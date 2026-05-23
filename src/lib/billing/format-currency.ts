/** Formato visual COP sin símbolo: 50000 → "50.000" */
export function formatCopInput(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "";
  return new Intl.NumberFormat("es-CO", {
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

/** Parsea "50.000" o "50000" → 50000 */
export function parseCopInput(raw: string): number {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return 0;
  const n = parseInt(digits, 10);
  return Number.isFinite(n) ? n : 0;
}

export const digitsOnly = (value: string) => value.replace(/\D/g, "");
