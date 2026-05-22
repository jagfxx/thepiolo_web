"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";

const options: { locale: Locale; label: string }[] = [
  { locale: "en", label: "EN" },
  { locale: "es", label: "ES" },
];

type Segment = { width: number; left: number };

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale, dict } = useLanguage();
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [segments, setSegments] = useState<Segment[]>([]);

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const buttons = container.querySelectorAll<HTMLButtonElement>("[data-locale-btn]");
    const containerRect = container.getBoundingClientRect();
    setSegments(
      Array.from(buttons).map((btn) => {
        const rect = btn.getBoundingClientRect();
        return {
          width: rect.width,
          left: rect.left - containerRect.left,
        };
      }),
    );
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, locale]);

  const activeIndex = options.findIndex((o) => o.locale === locale);
  const pill = segments[activeIndex];

  const spring = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 420, damping: 34, mass: 0.75 };

  return (
    <div
      ref={containerRef}
      role="group"
      aria-label={dict.a11y.switchLanguage}
      className={`relative inline-flex rounded-full border border-border bg-surface p-0.5 ${className}`}
    >
      {pill && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute top-0.5 bottom-0.5 rounded-full bg-gradient-accent shadow-[0_0_20px_rgba(180,64,255,0.35)]"
          initial={false}
          animate={{
            width: pill.width,
            x: pill.left,
          }}
          transition={spring}
        />
      )}

      {options.map(({ locale: loc, label }) => {
        const active = locale === loc;
        return (
          <button
            key={loc}
            type="button"
            data-locale-btn
            onClick={() => setLocale(loc)}
            aria-pressed={active}
            className={`relative z-10 min-w-[2.5rem] rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-300 ease-out ${
              active ? "text-white" : "text-muted hover:text-foreground"
            }`}
          >
            <motion.span
              animate={{ opacity: active ? 1 : 0.72 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="block"
            >
              {label}
            </motion.span>
          </button>
        );
      })}
    </div>
  );
}
