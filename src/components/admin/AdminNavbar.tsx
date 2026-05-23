"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { adminSignOut } from "@/app/admin/actions";
import { BrandLogo } from "@/components/admin/BrandLogo";
import {
  adminNavItems,
  adminNavLinkClass,
  adminNavMobileLinkClass,
} from "@/lib/admin-nav";

type AdminNavbarProps = {
  email?: string | null;
};

export function AdminNavbar({ email }: AdminNavbarProps) {
  const pathname = usePathname();
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
          scrolled ? "glass glow-accent" : "glass glow-accent"
        }`}
      >
        <BrandLogo
          variant="full"
          size="sm"
          href="/admin"
          subtitle="Admin"
          priority
          className="shrink-0"
        />

        <ul className="hidden flex-1 items-center justify-center gap-6 lg:flex xl:gap-8">
          {adminNavItems.map((item) => {
            const active = item.match(pathname);
            return (
              <li key={item.href}>
                <Link href={item.href} className={adminNavLinkClass(active)}>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          {email ? (
            <span className="max-w-[160px] truncate text-xs text-muted" title={email}>
              {email}
            </span>
          ) : null}
          <Link
            href="/"
            className="text-sm text-foreground-subtle transition-colors hover:text-foreground"
          >
            Sitio
          </Link>
          <form action={adminSignOut}>
            <button
              type="submit"
              className="rounded-full border border-border px-4 py-2 text-sm text-foreground-subtle transition-colors hover:border-border-hover hover:text-foreground"
            >
              Cerrar sesión
            </button>
          </form>
          <Link
            href="/admin/invoices/new"
            className="rounded-full bg-gradient-accent px-5 py-2 text-sm font-medium text-white transition-all hover:brightness-110"
          >
            Nueva cuenta
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <form action={adminSignOut}>
            <button
              type="submit"
              className="rounded-full border border-border px-3 py-1.5 text-xs text-foreground-subtle"
            >
              Salir
            </button>
          </form>
          <button
            type="button"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground"
            onClick={() => setMobileOpen((open) => !open)}
          >
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

      {mobileOpen ? (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-2 max-w-6xl rounded-2xl glass p-4 md:hidden"
        >
          {email ? <p className="mb-3 truncate px-3 text-xs text-muted">{email}</p> : null}
          <ul className="flex flex-col gap-1">
            {adminNavItems.map((item) => {
              const active = item.match(pathname);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={adminNavMobileLinkClass(active)}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li className="mt-2 border-t border-border pt-2">
              <Link
                href="/"
                className="block rounded-lg px-3 py-2.5 text-sm text-foreground-subtle hover:bg-surface-elevated hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                Ver sitio
              </Link>
            </li>
            <li className="mt-2">
              <Link
                href="/admin/invoices/new"
                className="block rounded-full bg-gradient-accent px-4 py-2.5 text-center text-sm font-medium text-white"
                onClick={() => setMobileOpen(false)}
              >
                Nueva cuenta
              </Link>
            </li>
          </ul>
        </motion.div>
      ) : null}
    </motion.header>
  );
}
