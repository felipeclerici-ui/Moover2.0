import { ANIMAL_TYPES } from "./constants.js";

// DICOSE_RE / isValidDicose viven ahora en dicose.js (junto al mapa de
// departamentos). Re-exportamos para no romper imports existentes.
export { DICOSE_RE, isValidDicose } from "./dicose.js";

// RUT UY: 12 dígitos
export const isValidRut = (v) => {
  if (!v) return true;
  const d = String(v).replace(/[^\d]/g, "");
  return d.length === 12;
};

export const animalRequiresGuide = (animalId) => {
  const a = ANIMAL_TYPES.find((x) => x.id === animalId);
  return a ? !!a.requiresGuide : true;
};
