// --- Address Meta (Photon → estructura interna) ---
// Photon devuelve features GeoJSON con properties.type ∈
// {house, street, locality, district, city, county, state, country, other}.
// Rechazamos `state` y `country`: son demasiado genéricos para un flete.

import { DEPARTMENTS } from "./constants.js";

export const ALLOWED_ADDRESS_TYPES = [
  "house",
  "street",
  "locality",
  "district",
  "city",
  "county",
];

/**
 * Photon a veces devuelve el estado como "Departamento de Durazno",
 * "Durazno Department" o simplemente "Durazno". Normalizamos al label
 * oficial usado en `constants.DEPARTMENTS`.
 */
export const normalizeDepartment = (raw) => {
  if (!raw) return null;
  const cleaned = String(raw)
    .replace(/^Departamento de\s+/i, "")
    .replace(/\s+Department$/i, "")
    .trim();
  // Match case-insensitive contra la lista oficial
  const found = DEPARTMENTS.find(
    (d) => d.toLowerCase() === cleaned.toLowerCase(),
  );
  return found || cleaned;
};

/** Igual lógica que el formatSuggestion original — display human-readable. */
export const formatAddressDisplay = (feature) => {
  const p = feature?.properties || {};
  const parts = [];
  if (p.street) {
    parts.push(p.housenumber ? `${p.street} ${p.housenumber}` : p.street);
  } else if (p.name) {
    parts.push(p.name);
  }
  if (p.city && p.city !== p.name) parts.push(p.city);
  else if (p.state && p.state !== p.name) parts.push(p.state);
  parts.push(p.country || "Uruguay");
  return parts.filter(Boolean).join(", ");
};

/** Convierte un feature Photon en el meta que persistimos en bookingData. */
export const featureToAddressMeta = (feature) => {
  if (!feature || !feature.properties) return null;
  const p = feature.properties;
  const [lon, lat] = feature.geometry?.coordinates || [null, null];
  return {
    display: formatAddressDisplay(feature),
    lat,
    lon,
    type: p.type || null,
    department: normalizeDepartment(p.state),
    city: p.city || null,
    osmId: p.osm_id || null,
  };
};

export const isValidAddressMeta = (meta) =>
  !!meta && ALLOWED_ADDRESS_TYPES.includes(meta.type);

// --- Soporte para pegar links de Google Maps ---
// La gente suele compartir la ubicación como un link de Maps. Aceptamos:
//   • URLs completas con coordenadas (@lat,lng / !3d!4d / ?q=lat,lng / ll=)
//   • Links cortos (maps.app.goo.gl / goo.gl/maps) → se resuelven vía proxy CORS
// y reverse-geocodeamos a una dirección legible con departamento.

const PHOTON_REVERSE = "https://photon.komoot.io/reverse";
const CORS_PROXY = (url) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`;

export const isGoogleMapsUrl = (text) =>
  /https?:\/\/(www\.)?(google\.[a-z.]+\/maps|maps\.google\.[a-z.]+|maps\.app\.goo\.gl|goo\.gl\/maps)/i.test(
    String(text || "").trim(),
  );

/** Extrae { lat, lon } de una URL de Google Maps (o de su HTML). null si no hay. */
export const parseLatLngFromUrl = (text) => {
  const t = String(text || "");
  const patterns = [
    /@(-?\d{1,2}\.\d+),(-?\d{1,3}\.\d+)/, // .../@-34.90,-56.16,15z
    /!3d(-?\d{1,2}\.\d+)!4d(-?\d{1,3}\.\d+)/, // data=...!3d-34.9!4d-56.1
    /[?&](?:q|ll|center|destination|daddr|saddr)=(-?\d{1,2}\.\d+),(-?\d{1,3}\.\d+)/,
  ];
  for (const re of patterns) {
    const m = t.match(re);
    if (m) {
      const lat = parseFloat(m[1]);
      const lon = parseFloat(m[2]);
      if (!Number.isNaN(lat) && !Number.isNaN(lon)) return { lat, lon };
    }
  }
  return null;
};

/** Reverse geocode (Photon) → addressMeta, conservando las coords exactas del pin. */
export const reverseGeocodeToMeta = async (lat, lon) => {
  try {
    const r = await fetch(`${PHOTON_REVERSE}?lat=${lat}&lon=${lon}&lang=es`);
    const data = await r.json();
    const f = data.features?.[0];
    if (f) {
      const meta = featureToAddressMeta(f);
      return { ...meta, lat, lon, source: "maps-link" };
    }
  } catch {
    /* sin conexión / sin resultado → caemos al pin crudo */
  }
  return {
    display: `Ubicación marcada (${lat.toFixed(4)}, ${lon.toFixed(4)})`,
    lat,
    lon,
    type: "locality",
    department: null,
    city: null,
    osmId: null,
    source: "maps-link",
  };
};

/**
 * Resuelve un link de Google Maps a addressMeta.
 * Devuelve null si no se pudo extraer una ubicación.
 */
export const resolveGoogleMapsLink = async (text) => {
  const url = String(text || "").trim();
  const direct = parseLatLngFromUrl(url);
  if (direct) return reverseGeocodeToMeta(direct.lat, direct.lon);

  // Link corto → seguimos el redirect vía proxy y buscamos coords en la URL/HTML final.
  try {
    const res = await fetch(CORS_PROXY(url));
    const fromFinalUrl = parseLatLngFromUrl(res.url || "");
    if (fromFinalUrl) return reverseGeocodeToMeta(fromFinalUrl.lat, fromFinalUrl.lon);
    const body = await res.text();
    const fromBody = parseLatLngFromUrl(body);
    if (fromBody) return reverseGeocodeToMeta(fromBody.lat, fromBody.lon);
  } catch {
    /* el proxy puede fallar; devolvemos null y el usuario pega el link completo */
  }
  return null;
};
