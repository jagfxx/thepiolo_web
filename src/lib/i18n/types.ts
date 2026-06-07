export type Locale = "en" | "es";

export const locales: Locale[] = ["en", "es"];
export const defaultLocale: Locale = "en";
export const LOCALE_STORAGE_KEY = "thepiolo-locale";

export type NavKey =
  | "services"
  | "work"
  | "plans"
  | "process"
  | "stack"
  | "contact";

export type PlanId = "foundation" | "business" | "custom";

export type PlanSpecRow = {
  label: string;
  foundation: string;
  business: string;
  custom: string;
};

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
  plans: {
    label: string;
    title: string;
    description: string;
    ladderLabel: string;
    specLabel: string;
    specFeatureColumn: string;
    priceFrom: string;
    customPrice: string;
    checkmark: string;
    notApplicable: string;
    perAgreement: string;
    viewFeatures: string;
    closeFeatures: string;
    featuresIncluded: string;
    compareAll: string;
    items: {
      id: PlanId;
      step: string;
      title: string;
      price: string;
      tagline: string;
      audience: string;
      examplesLabel?: string;
      examples?: string[];
      cta: string;
      highlighted?: boolean;
    }[];
    specRows: PlanSpecRow[];
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
    title: string;
    description: string;
    reassurance: string;
    whatsappCta: string;
    responseTime: string;
    directLinks: string;
  };
  leads: {
    cta: string;
    floatingLabel: string;
    messages: {
      general: string;
      hero: string;
      navbar: string;
      contact: string;
      work: string;
      foundation: string;
      business: string;
      custom: string;
    };
  };
  social: {
    instagram: string;
    instagramAria: string;
    whatsapp: string;
    whatsappAria: string;
    email: string;
    emailAria: string;
    connect: string;
  };
  footer: {
    tagline: string;
    rights: string;
    connect: string;
  };
};
