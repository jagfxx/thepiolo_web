"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { navKeys } from "@/lib/data";
import { useLanguage } from "@/lib/i18n/context";
import type { NavKey } from "@/lib/i18n/types";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { LocaleContentFade } from "@/components/ui/LocaleContentFade";

export function Navbar() {
  const { dict, navHref } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 40);
  });

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 px-5 transition-all duration-300 sm:px-8 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-2xl px-4 py-3 transition-all duration-300 sm:px-6 ${
          scrolled ? "glass glow-accent" : "bg-transparent"
        }`}
      >
        <Link href="/" className="flex shrink-0 items-center gap-2.5" onClick={() => setMobileOpen(false)}>
          <Image
            src="/THEPIOLO-ONLYLOGO-05.svg"
            alt="THEPIOLO"
            width={36}
            height={36}
            className="h-8 w-8 sm:h-9 sm:w-9"
            priority
          />
          <span className="font-display text-sm font-semibold tracking-wide text-foreground sm:text-base">
            THEPIOLO
          </span>
        </Link>

        <LocaleContentFade className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center">
          <ul className="flex items-center gap-6 xl:gap-8">
            {navKeys.map((key) => (
              <li key={key}>
                <Link
                  href={navHref(key as NavKey)}
                  className="text-sm text-foreground-subtle transition-colors hover:text-foreground"
                >
                  {dict.nav[key as NavKey]}
                </Link>
              </li>
            ))}
          </ul>
        </LocaleContentFade>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          <LocaleContentFade>
            <Link
              href="#contact"
              className="rounded-full bg-gradient-accent px-5 py-2 text-sm font-medium text-white transition-all hover:brightness-110"
            >
              {dict.nav.getInTouch}
            </Link>
          </LocaleContentFade>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            aria-label={mobileOpen ? dict.a11y.closeMenu : dict.a11y.openMenu}
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span className="sr-only">{dict.a11y.menu}</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              {mobileOpen ? (
                <path
                  d="M5 5l10 10M15 5L5 15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M3 6h14M3 10h14M3 14h14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-2 max-w-6xl rounded-2xl glass p-4 md:hidden"
        >
          <LocaleContentFade>
            <ul className="flex flex-col gap-1">
              {navKeys.map((key) => (
                <li key={key}>
                  <Link
                    href={navHref(key as NavKey)}
                    className="block rounded-lg px-3 py-2.5 text-sm text-foreground-subtle hover:bg-surface-elevated hover:text-foreground"
                    onClick={() => setMobileOpen(false)}
                  >
                    {dict.nav[key as NavKey]}
                  </Link>
                </li>
              ))}
              <li className="mt-2 border-t border-border pt-2">
                <Link
                  href="#contact"
                  className="block rounded-full bg-gradient-accent px-4 py-2.5 text-center text-sm font-medium text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  {dict.nav.getInTouch}
                </Link>
              </li>
            </ul>
          </LocaleContentFade>
        </motion.div>
      )}
    </motion.header>
  );
}
