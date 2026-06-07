import { whatsappUrl } from "@/lib/site";
import type { Dictionary, PlanId } from "@/lib/i18n/types";

export type LeadIntent =
  | "general"
  | "hero"
  | "navbar"
  | "contact"
  | "work"
  | PlanId;

export function getLeadWhatsAppUrl(
  messages: Dictionary["leads"]["messages"],
  intent: LeadIntent,
) {
  return whatsappUrl(messages[intent]);
}
