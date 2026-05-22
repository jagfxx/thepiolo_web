import { en } from "./dictionaries/en";
import { es } from "./dictionaries/es";
import type { Dictionary, Locale } from "./types";

export const dictionaries: Record<Locale, Dictionary> = { en, es };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export * from "./types";
