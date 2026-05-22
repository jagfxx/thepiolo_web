export const SITE_URL = "https://thepiolo.icu";

export const siteConfig = {
  name: "Thepiolo",
  legalName: "THEPIOLO Digital Web Studio",
  url: SITE_URL,
  locale: "es_CO",
  email: "thepiolo.co@gmail.com",
  instagram: {
    handle: "thepiolo.co",
    url: "https://www.instagram.com/thepiolo.co/",
  },
  whatsapp: {
    number: "573244312649",
    display: "+57 324 431 2649",
    url: "https://wa.me/573244312649",
  },
} as const;

export const mailtoUrl = `mailto:${siteConfig.email}`;

export function whatsappUrl(message?: string) {
  if (!message) return siteConfig.whatsapp.url;
  return `${siteConfig.whatsapp.url}?text=${encodeURIComponent(message)}`;
}
