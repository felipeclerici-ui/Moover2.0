// --- DICOSE (Departamento de Industria Comercio y Servicios — MGAP / SISA) ---
// El primer par de dígitos del DICOSE codifica el departamento según el orden
// oficial alfabético (1–19). Esta tabla es "demo grade":
// para producción debe verificarse contra padrón MGAP/SISA actualizado.

import { ESTABLECIMIENTOS_DATA } from "../data/establecimientos.js";

export const DICOSE_DEPT_PREFIX_MAP = {
  "01": "Artigas",
  "02": "Canelones",
  "03": "Cerro Largo",
  "04": "Colonia",
  "05": "Durazno",
  "06": "Flores",
  "07": "Florida",
  "08": "Lavalleja",
  "09": "Maldonado",
  "10": "Montevideo",
  "11": "Paysandú",
  "12": "Río Negro",
  "13": "Rivera",
  "14": "Rocha",
  "15": "Salto",
  "16": "San José",
  "17": "Soriano",
  "18": "Tacuarembó",
  "19": "Treinta y Tres",
};

// Formato: 7–8 dígitos con puntos opcionales (ej: "05.345.678" o "5345678").
export const DICOSE_RE = /^\d{2,3}\.?\d{3}\.?\d{3}$|^\d{7,8}$/;

export const isValidDicose = (v) => !v || DICOSE_RE.test(String(v).trim());

/** Saca puntos, espacios y guiones → solo dígitos. */
export const normalizeDicose = (v) => String(v || "").replace(/[^\d]/g, "");

/** Devuelve nombre del departamento o null. */
export const getDicoseDepartment = (dicose) => {
  const digits = normalizeDicose(dicose);
  if (digits.length < 2) return null;
  // Si tiene 7 dígitos, el prefijo es el primer dígito con un 0 adelante.
  // Si tiene 8 dígitos, el prefijo son los primeros dos.
  const prefix = digits.length === 7 ? "0" + digits.slice(0, 1) : digits.slice(0, 2);
  return DICOSE_DEPT_PREFIX_MAP[prefix] || null;
};

/** Busca el establecimiento exacto en la base de datos. */
export const getEstablecimientoByDicose = (dicose) => {
  const target = normalizeDicose(dicose);
  if (target.length < 7) return null;
  return (
    ESTABLECIMIENTOS_DATA.find((e) => normalizeDicose(e.dicose) === target) ||
    null
  );
};
