import React, { useState, useEffect, useRef } from "react";
import {
  featureToAddressMeta,
  isValidAddressMeta,
  formatAddressDisplay,
  isGoogleMapsUrl,
  resolveGoogleMapsLink,
} from "../../lib/addressMeta.js";

const PHOTON_URL = "https://photon.komoot.io/api/";

export const AddressAutocomplete = ({
  label,
  placeholder,
  icon,
  value,
  onChange,
  onSelect,
  meta = null,
}) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [touched, setTouched] = useState(false);
  const [resolvingLink, setResolvingLink] = useState(false);
  const [linkError, setLinkError] = useState(null);
  const containerRef = useRef(null);
  const debounceRef = useRef(null);
  const resolvedDisplayRef = useRef(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    // No buscamos sugerencias para links de Maps ni para una dirección que
    // acabamos de resolver (evita reabrir el dropdown encima del resultado).
    if (
      !query ||
      query.length < 2 ||
      isGoogleMapsUrl(query) ||
      query === resolvedDisplayRef.current
    ) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setLoading(true);
      fetch(
        `${PHOTON_URL}?q=${encodeURIComponent(query + " Uruguay")}&limit=8&lat=-34.9&lon=-56.2`,
      )
        .then((r) => r.json())
        .then((data) => {
          // Filtramos a UY y a tipos lo suficientemente específicos
          const features = (data.features || []).filter((f) => {
            const p = f.properties || {};
            const cc = (p.countrycode || "").toUpperCase();
            if (cc !== "UY") return false;
            // Excluimos `country` y `state` (demasiado genéricos)
            if (p.type === "country" || p.type === "state") return false;
            return true;
          });
          setSuggestions(features);
          setOpen(features.length > 0);
          setActiveIdx(-1);
        })
        .catch(() => setSuggestions([]))
        .finally(() => setLoading(false));
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const select = (f) => {
    const display = formatAddressDisplay(f);
    const newMeta = featureToAddressMeta(f);
    resolvedDisplayRef.current = display;
    setQuery(display);
    setLinkError(null);
    onChange({ target: { value: display } });
    if (onSelect) onSelect(newMeta);
    setOpen(false);
    setTouched(true);
  };

  // Resuelve un link de Google Maps pegado → dirección + meta (lat/lon/dept).
  const resolveLink = async (url) => {
    setOpen(false);
    setSuggestions([]);
    setLinkError(null);
    setResolvingLink(true);
    setTouched(true);
    const resolved = await resolveGoogleMapsLink(url);
    setResolvingLink(false);
    if (resolved) {
      resolvedDisplayRef.current = resolved.display;
      setQuery(resolved.display);
      onChange({ target: { value: resolved.display } });
      if (onSelect) onSelect(resolved);
    } else {
      setLinkError(
        "No pudimos leer ese link. Pegá el link completo de Google Maps (con coordenadas) o buscá la dirección.",
      );
      onChange({ target: { value: url } });
      if (onSelect) onSelect(null);
    }
  };

  const onInputChange = (e) => {
    const v = e.target.value;
    setQuery(v);
    setLinkError(null);
    setTouched(true);
    if (isGoogleMapsUrl(v)) {
      resolveLink(v);
      return;
    }
    onChange(e);
    // Texto libre → invalidamos cualquier meta previo
    if (onSelect && meta) onSelect(null);
  };

  const onPaste = (e) => {
    const text = (e.clipboardData || window.clipboardData)?.getData("text") || "";
    if (isGoogleMapsUrl(text)) {
      e.preventDefault();
      setQuery(text);
      resolveLink(text);
    }
  };

  const onKeyDown = (e) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      select(suggestions[activeIdx]);
    }
  };

  const hasValue = !!(value && value.trim());
  const invalid = touched && hasValue && !isValidAddressMeta(meta);
  const showOkBadge = hasValue && isValidAddressMeta(meta);

  return (
    <div className="mb-4" ref={containerRef}>
      <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 ml-1">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-3.5 w-5 h-5 text-stone-400">{icon}</span>
        )}
        <input
          type="text"
          value={query}
          onChange={onInputChange}
          onPaste={onPaste}
          onFocus={() =>
            query.length >= 2 && suggestions.length > 0 && setOpen(true)
          }
          onKeyDown={onKeyDown}
          className={`w-full bg-stone-50 border rounded-xl py-3.5 ${icon ? "pl-11" : "pl-4"} pr-10 focus:outline-none focus:ring-2 focus:bg-white transition-all text-stone-800 font-medium ${
            invalid
              ? "border-red-300 focus:ring-red-500"
              : "border-stone-200 focus:ring-emerald-500"
          }`}
          placeholder={placeholder}
          autoComplete="off"
        />
        {(loading || resolvingLink) && (
          <span className="absolute right-4 top-3.5 text-stone-400 text-sm">...</span>
        )}
        {showOkBadge && !loading && !resolvingLink && (
          <span className="absolute right-4 top-3.5 text-emerald-500 text-sm font-bold">✓</span>
        )}
        {open && suggestions.length > 0 && (
          <div className="absolute z-50 left-0 right-0 mt-1 bg-white rounded-xl border border-stone-200 shadow-lg overflow-hidden">
            {suggestions.map((f, i) => (
              <button
                key={f.properties?.osm_id || i}
                type="button"
                onClick={() => select(f)}
                className={`w-full text-left px-4 py-3 text-sm hover:bg-emerald-50 ${i === activeIdx ? "bg-emerald-50" : ""}`}
              >
                {formatAddressDisplay(f)}
              </button>
            ))}
          </div>
        )}
      </div>
      {resolvingLink && (
        <p className="text-xs text-stone-500 mt-2 ml-1">
          Leyendo ubicación del link de Google Maps...
        </p>
      )}
      {linkError && <p className="text-xs text-red-600 mt-2 ml-1">{linkError}</p>}
      {invalid && !resolvingLink && !linkError && (
        <p className="text-xs text-red-600 mt-2 ml-1">
          Elegí una opción de la lista o pegá un link de Google Maps para confirmar la ubicación.
        </p>
      )}
      {showOkBadge && meta?.department && (
        <p className="text-xs text-emerald-700 mt-2 ml-1">
          ✓ Ubicación confirmada · {meta.department}
        </p>
      )}
      {!touched && !showOkBadge && (
        <p className="text-xs text-stone-400 mt-2 ml-1">
          Tip: podés pegar un link de Google Maps.
        </p>
      )}
    </div>
  );
};
