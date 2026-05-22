export type Locale = "en" | "es";

export const locales: Locale[] = ["en", "es"];
export const defaultLocale: Locale = "en";
export const LOCALE_STORAGE_KEY = "thepiolo-locale";

export type NavKey = "about" | "services" | "work" | "process" | "stack" | "contact";

export type Dictionary = {
  meta: {
    title: string;
    description: string;
  };
  nav: Record<NavKey, string> & { getInTouch: string };
  a11y: {
    openMenu: string;
    closeMenu: string;
    menu: string;
    switchLanguage: string;
  };
  hero: {
    logoAlt: string;
    tagline: string;
    headlineBefore: string;
    headlineHighlight: string;
    headlineAfter: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
    pills: string[];
  };
  about: {
    label: string;
    title: string;
    description: string;
    highlights: { title: string; description: string }[];
  };
  services: {
    label: string;
    title: string;
    description: string;
    items: { title: string; description: string }[];
  };
  work: {
    label: string;
    title: string;
    description: string;
    caseStudy: string;
    subtitle: string;
    body: string;
    tags: string[];
    features: string[];
    stackLabel: string;
    stack: string[];
    visitSite: string;
    visitSiteAria: string;
    visitInstagram: string;
    visitInstagramAria: string;
    cta: string;
  };
  process: {
    label: string;
    title: string;
    description: string;
    steps: { step: string; title: string; description: string }[];
  };
  stack: {
    label: string;
    title: string;
    description: string;
    categories: Record<string, string>;
  };
  contact: {
    label: string;
    titleBefore: string;
    titleHighlight: string;
    description: string;
    responseTime: string;
  };
  footer: {
    tagline: string;
    rights: string;
  };
};
