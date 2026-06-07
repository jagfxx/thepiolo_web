"use client";

import { motion } from "framer-motion";
import { siteConfig, mailtoUrl } from "@/lib/site";
import { getLeadWhatsAppUrl } from "@/lib/leads";
import { useLanguage } from "@/lib/i18n/context";

type SocialLinksProps = {
  variant?: "icons" | "buttons";
  className?: string;
};

function InstagramIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function EmailIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

const links = [
  {
    key: "whatsapp" as const,
    labelKey: "whatsapp" as const,
    Icon: WhatsAppIcon,
    primary: true,
  },
  {
    key: "instagram" as const,
    labelKey: "instagram" as const,
    Icon: InstagramIcon,
    primary: false,
  },
  {
    key: "email" as const,
    labelKey: "email" as const,
    Icon: EmailIcon,
    primary: false,
  },
];

export function SocialLinks({ variant = "icons", className = "" }: SocialLinksProps) {
  const { dict } = useLanguage();
  const s = dict.social;

  const hrefFor = (key: (typeof links)[number]["key"]) => {
    if (key === "whatsapp") return getLeadWhatsAppUrl(dict.leads.messages, "general");
    if (key === "instagram") return siteConfig.instagram.url;
    return mailtoUrl;
  };

  if (variant === "buttons") {
    return (
      <div className={`flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center ${className}`}>
        {links.map(({ key, labelKey, Icon, primary }, i) => (
          <motion.a
            key={key}
            href={hrefFor(key)}
            target={key === "email" ? undefined : "_blank"}
            rel={key === "email" ? undefined : "noopener noreferrer"}
            aria-label={
              labelKey === "instagram"
                ? s.instagramAria
                : labelKey === "whatsapp"
                  ? s.whatsappAria
                  : s.emailAria
            }
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={
              primary
                ? "inline-flex items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-6 py-3 text-sm font-medium text-white shadow-[0_0_32px_rgba(37,211,102,0.25)] transition-all hover:brightness-110"
                : "inline-flex items-center justify-center gap-2.5 rounded-full border border-border bg-surface px-6 py-3 text-sm font-medium text-foreground transition-all hover:border-border-hover hover:bg-surface-elevated"
            }
          >
            <Icon className="h-4 w-4" />
            {s[labelKey]}
          </motion.a>
        ))}
      </div>
    );
  }

  return (
    <ul className={`flex items-center gap-3 ${className}`}>
      {links.map(({ key, labelKey, Icon }) => (
        <li key={key}>
          <a
            href={hrefFor(key)}
            target="_blank"
            rel={key === "email" ? undefined : "noopener noreferrer me"}
            aria-label={
              labelKey === "instagram"
                ? s.instagramAria
                : labelKey === "whatsapp"
                  ? s.whatsappAria
                  : s.emailAria
            }
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground-subtle transition-all hover:border-border-hover hover:bg-surface-elevated hover:text-foreground hover:shadow-[0_0_24px_rgba(180,64,255,0.2)]"
          >
            <Icon />
          </a>
        </li>
      ))}
    </ul>
  );
}
