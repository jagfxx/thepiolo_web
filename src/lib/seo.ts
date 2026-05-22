import type { Metadata } from "next";
import { siteConfig, SITE_URL } from "./site";

const defaultTitle = "Thepiolo — Estudio Web Premium | Diseño, Desarrollo y Branding";
const defaultDescription =
  "THEPIOLO: estudio web en Medellín. Diseño UI/UX, desarrollo Next.js, landing pages, branding y despliegue. Portafolio premium para marcas que buscan presencia digital de alto nivel.";

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: defaultTitle,
    template: "%s | Thepiolo",
  },
  description: defaultDescription,
  applicationName: siteConfig.name,
  authors: [{ name: "THEPIOLO", url: SITE_URL }],
  creator: "THEPIOLO",
  publisher: "THEPIOLO",
  category: "technology",
  keywords: [
    "THEPIOLO",
    "thepiolo",
    "estudio web",
    "web studio",
    "desarrollo web",
    "web developer",
    "diseño web",
    "UI UX",
    "branding digital",
    "landing page",
    "Next.js developer",
    "freelance developer",
    "Medellín",
    "Colombia",
    "agencia digital",
    "portafolio desarrollador",
    "sitios web premium",
    "thepiolo.icu",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    alternateLocale: ["en_US"],
    url: SITE_URL,
    siteName: siteConfig.name,
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: "/THEPIOLO-05.svg",
        width: 1200,
        height: 630,
        alt: "THEPIOLO — Digital Web Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    creator: "@thepiolo.co",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: "/THEPIOLO-ONLYLOGO-05.svg", type: "image/svg+xml" }],
    apple: [{ url: "/THEPIOLO-ONLYLOGO-05.svg", type: "image/svg+xml" }],
  },
  manifest: "/manifest.webmanifest",
  other: {
    "geo.region": "CO-ANT",
    "geo.placename": "Medellín",
  },
};

export function getJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: siteConfig.name,
        description: defaultDescription,
        inLanguage: ["es", "en"],
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "ProfessionalService",
        "@id": `${SITE_URL}/#organization`,
        name: siteConfig.legalName,
        url: SITE_URL,
        image: `${SITE_URL}/THEPIOLO-05.svg`,
        logo: `${SITE_URL}/THEPIOLO-ONLYLOGO-05.svg`,
        email: siteConfig.email,
        areaServed: {
          "@type": "Country",
          name: "Colombia",
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Medellín",
          addressCountry: "CO",
        },
        sameAs: [siteConfig.instagram.url],
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer service",
            email: siteConfig.email,
            telephone: `+${siteConfig.whatsapp.number}`,
            availableLanguage: ["Spanish", "English"],
            areaServed: "CO",
          },
        ],
        knowsAbout: [
          "Web Design",
          "Web Development",
          "UI/UX Design",
          "Branding",
          "Next.js",
          "Landing Pages",
        ],
        priceRange: "$$",
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: defaultTitle,
        description: defaultDescription,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "es",
      },
    ],
  };
}
