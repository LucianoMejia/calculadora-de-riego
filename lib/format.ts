export function fmt(n: number | null | undefined, decimals: number = 2): string {
  if (n === null || n === undefined || isNaN(n)) return '—';
  return Number(n).toLocaleString('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

export function parseNum(v: string): number | null {
  const n = parseFloat(v.replace(',', '.'));
  return isNaN(n) ? null : n;
}
