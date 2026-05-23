/** Tokens de marca THEPIOLO (alineados con globals.css) */
export const brand = {
  background: "#13131E",
  surface: "#1A1A28",
  surfaceElevated: "#222233",
  border: "#3A3A52",
  muted: "#8B8B9E",
  foreground: "#F4F4F8",
  foregroundSubtle: "#C8C8D4",
  accentStart: "#B440FF",
  accentMid: "#FF71E4",
  accentEnd: "#FF2E2E",
} as const;

export const statusLabels: Record<string, string> = {
  DRAFT: "Borrador",
  ISSUED: "Emitida",
  PAID: "Pagada",
  CANCELLED: "Anulada",
};
