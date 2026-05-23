import { siteConfig } from "@/lib/site";

export const billingIssuer = {
  name: siteConfig.legalName,
  brand: siteConfig.name,
  email: siteConfig.email,
  phone: siteConfig.whatsapp.display,
  instagram: `@${siteConfig.instagram.handle}`,
  website: siteConfig.url,
  defaultPaymentInstructions: [
    "Transferencia o consignación — solicitar datos bancarios por WhatsApp o correo.",
    `WhatsApp: ${siteConfig.whatsapp.display}`,
    `Correo: ${siteConfig.email}`,
  ].join("\n"),
} as const;
