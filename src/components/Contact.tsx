"use client";

import { motion } from "framer-motion";
import { fadeUp, scaleIn } from "@/lib/motion";
import { useLanguage } from "@/lib/i18n/context";
import { getLeadWhatsAppUrl } from "@/lib/leads";
import { siteConfig, mailtoUrl } from "@/lib/site";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { SocialLinks } from "@/components/SocialLinks";

function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function Contact() {
  const { dict } = useLanguage();
  const c = dict.contact;

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-border/50 px-5 py-24 sm:px-8 sm:py-32 lg:py-40"
    >
      <GlowOrb className="left-1/2 bottom-0 -translate-x-1/2 translate-y-1/3" size="lg" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={scaleIn}
        className="relative z-10 mx-auto max-w-3xl rounded-3xl border border-border glass p-8 text-center sm:p-12 lg:p-16"
      >
        <motion.p variants={fadeUp} className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          {c.label}
        </motion.p>
        <motion.h2
          variants={fadeUp}
          custom={1}
          className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-tight"
        >
          {c.title}
        </motion.h2>
        <motion.p
          variants={fadeUp}
          custom={2}
          className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-foreground-subtle sm:text-lg"
        >
          {c.description}
        </motion.p>
        <motion.p
          variants={fadeUp}
          custom={3}
          className="mx-auto mt-3 max-w-md text-sm text-muted"
        >
          {c.reassurance}
        </motion.p>

        <motion.div variants={fadeUp} custom={4} className="mt-10">
          <a
            href={getLeadWhatsAppUrl(dict.leads.messages, "contact")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full max-w-sm items-center justify-center gap-2.5 rounded-full bg-gradient-accent px-8 py-4 text-base font-medium text-white glow-accent transition-all hover:brightness-110 sm:w-auto"
          >
            <WhatsAppIcon />
            {c.whatsappCta}
          </a>
        </motion.div>

        <motion.p
          variants={fadeUp}
          custom={5}
          className="mt-10 font-mono text-xs uppercase tracking-[0.15em] text-muted"
        >
          {c.directLinks}
        </motion.p>

        <motion.div variants={fadeUp} custom={6} className="mt-6">
          <SocialLinks variant="buttons" />
        </motion.div>

        <motion.div
          variants={fadeUp}
          custom={7}
          className="mt-8 grid grid-cols-1 gap-3 text-xs text-muted sm:grid-cols-3 sm:gap-4"
        >
          <a
            href={siteConfig.instagram.url}
            target="_blank"
            rel="noopener noreferrer me"
            className="text-center transition-colors hover:text-foreground"
          >
            @{siteConfig.instagram.handle}
          </a>
          <a
            href={getLeadWhatsAppUrl(dict.leads.messages, "contact")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-center transition-colors hover:text-foreground"
          >
            {siteConfig.whatsapp.display}
          </a>
          <a href={mailtoUrl} className="text-center transition-colors hover:text-foreground">
            {siteConfig.email}
          </a>
        </motion.div>

        <motion.p variants={fadeUp} custom={8} className="mt-8 text-xs text-muted">
          {c.responseTime}
        </motion.p>
      </motion.div>
    </section>
  );
}
