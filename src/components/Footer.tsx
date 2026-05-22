"use client";

import Image from "next/image";
import Link from "next/link";
import { navKeys } from "@/lib/data";
import { useLanguage } from "@/lib/i18n/context";
import type { NavKey } from "@/lib/i18n/types";
import { SocialLinks } from "@/components/SocialLinks";

export function Footer() {
  const { dict, navHref } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/THEPIOLO-ONLYLOGO-05.svg"
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 opacity-80"
                aria-hidden
              />
              <div>
                <p className="font-display text-sm font-semibold text-foreground">THEPIOLO</p>
                <p className="text-xs text-muted">{dict.footer.tagline}</p>
              </div>
            </div>
            <div>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-muted">
                {dict.footer.connect}
              </p>
              <SocialLinks variant="icons" />
            </div>
          </div>

          <ul className="flex flex-wrap gap-x-6 gap-y-2 lg:justify-center">
            {navKeys.map((key) => (
              <li key={key}>
                <Link
                  href={navHref(key as NavKey)}
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  {dict.nav[key as NavKey]}
                </Link>
              </li>
            ))}
          </ul>

          <p className="text-xs text-muted lg:text-right">
            © {year} THEPIOLO. {dict.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
