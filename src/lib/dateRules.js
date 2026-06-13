// --- Date Rules para fechas de flete ---
// Hoy: bloqueamos pasadas y > 60 días.
// Futuro (hardening): domingos sin emisión de guías + feriados nacionales.

const pad = (n) => String(n).padStart(2, "0");

const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const todayISO = () => toISO(new Date());

export const maxDateISO = (days = 60) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return toISO(d);
};

/**
 * Devuelve { valid, reason } donde reason ∈ {'past', 'too_far', 'invalid', null}.
 * Si la fecha está vacía → valid:true (es opcional).
 */
export const validatePreferredDate = (dateStr, { maxDays = 60 } = {}) => {
  if (!dateStr) return { valid: true, reason: null };
  // YYYY-MM-DD esperado del input[type=date]
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return { valid: false, reason: "invalid" };
  }
  const today = todayISO();
  if (dateStr < today) return { valid: false, reason: "past" };
  if (dateStr > maxDateISO(maxDays)) return { valid: false, reason: "too_far" };
  return { valid: true, reason: null };
};

export const dateRuleMessage = (reason) => {
  switch (reason) {
    case "past":
      return "No podés agendar para una fecha pasada.";
    case "too_far":
      return "Máximo 60 días en el futuro.";
    case "invalid":
      return "Formato de fecha inválido.";
    default:
      return "";
  }
};
