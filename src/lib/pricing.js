export function calculatePrice(qty) {
  const baseRate = 1200;
  const quantity = parseInt(qty) || 1;
  return `$${(quantity * baseRate).toLocaleString()} UYU`;
}
