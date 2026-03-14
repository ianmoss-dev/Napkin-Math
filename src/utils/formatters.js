export function formatCurrency(amount) {
  return '$' + Math.round(amount).toLocaleString('en-US');
}

export function formatCurrencyPair(amount) {
  const monthly = Math.round(amount);
  const annual = Math.round(amount * 12);
  return `${formatCurrency(monthly)}/mo · ${formatCurrency(annual)}/yr`;
}
