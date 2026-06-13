// --- Habilitación del Transportista (MGAP + DNT/MTOP) ---
// Demo grade: chequeo declarativo de campos + vencimientos.
// En producción se valida contra padrón MGAP/SISA + RPA del MTOP.

import { isValidDicose } from "./dicose.js";
import { todayISO } from "./dateRules.js";

export const REQUIRED_HAB_FIELDS = [
  "dicoseTransportista",
  "mgapHabNumber",
  "mgapHabExpiry",
  "licenseExpiry",
];

const HAB_FIELD_LABELS = {
  dicoseTransportista: "DICOSE Transportista",
  mgapHabNumber: "N° Habilitación MGAP",
  mgapHabExpiry: "Vencimiento MGAP",
  licenseExpiry: "Vencimiento Libreta",
};

const EXPIRY_FIELDS = ["mgapHabExpiry", "licenseExpiry"];

/**
 * Devuelve { verified, missing, expired, invalid } para mostrar feedback granular.
 * - missing: labels de campos vacíos.
 * - expired: labels de campos de fecha ya vencidos.
 * - invalid: labels de campos con formato inválido (ej: DICOSE mal escrito).
 */
export const isDriverVerified = (profile = {}) => {
  const missing = [];
  const expired = [];
  const invalid = [];

  for (const field of REQUIRED_HAB_FIELDS) {
    const val = profile[field];
    if (!val || (typeof val === "string" && !val.trim())) {
      missing.push(HAB_FIELD_LABELS[field]);
    }
  }

  if (profile.dicoseTransportista && !isValidDicose(profile.dicoseTransportista)) {
    invalid.push(HAB_FIELD_LABELS.dicoseTransportista);
  }

  const today = todayISO();
  for (const field of EXPIRY_FIELDS) {
    const val = profile[field];
    if (val && /^\d{4}-\d{2}-\d{2}$/.test(val) && val < today) {
      expired.push(HAB_FIELD_LABELS[field]);
    }
  }

  const verified = missing.length === 0 && expired.length === 0 && invalid.length === 0;
  return { verified, missing, expired, invalid };
};
