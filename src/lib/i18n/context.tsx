"use client";

import { useReducedMotion } from "framer-motion";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getDictionary } from "./index";
import {
  defaultLocale,
  LOCALE_STORAGE_KEY,
  type Dictionary,
  type Locale,
  type NavKey,
} from "./types";

const CONTENT_FADE_MS = 280;

type LanguageContextValue = {
  locale: Locale;
  dict: Dictionary;
  isTransitioning: boolean;
  setLocale: (locale: Locale) => void;
  navHref: (key: NavKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const navHrefs: Record<NavKey, string> = {
  services: "#services",
  work: "#work",
  plans: "#plans",
  process: "#process",
  stack: "#stack",
  contact: "#contact",
};

function readStoredLocale(): Locale {
  if (typeof window === "undefined") return defaultLocale;
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  return stored === "es" || stored === "en" ? stored : defaultLocale;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [dictLocale, setDictLocale] = useState<Locale>(defaultLocale);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mounted, setMounted] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const stored = readStoredLocale();
    setLocaleState(stored);
    setDictLocale(stored);
    setMounted(true);
  }, []);

  const setLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;

      setLocaleState(next);

      if (reduceMotion) {
        setDictLocale(next);
        localStorage.setItem(LOCALE_STORAGE_KEY, next);
        document.documentElement.lang = next;
        document.title = getDictionary(next).meta.title;
        return;
      }

      setIsTransitioning(true);
      window.setTimeout(() => {
        setDictLocale(next);
        localStorage.setItem(LOCALE_STORAGE_KEY, next);
        document.documentElement.lang = next;
        document.title = getDictionary(next).meta.title;
        window.requestAnimationFrame(() => {
          setIsTransitioning(false);
        });
      }, CONTENT_FADE_MS);
    },
    [locale, reduceMotion],
  );

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = dictLocale;
    document.title = getDictionary(dictLocale).meta.title;
  }, [dictLocale, mounted]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      dict: getDictionary(dictLocale),
      isTransitioning,
      setLocale,
      navHref: (key) => navHrefs[key],
    }),
    [locale, dictLocale, isTransitioning, setLocale],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
