"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { TSM_INSTAGRAM_URL, TSM_PROJECT_URL } from "@/lib/data";
import { getLeadWhatsAppUrl } from "@/lib/leads";
import { useLanguage } from "@/lib/i18n/context";
import { fadeUp, scaleIn, staggerContainer } from "@/lib/motion";
import { GradientButton } from "@/components/ui/GradientButton";

function ExternalLinkIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function FeaturedProject() {
  const { dict } = useLanguage();
  const w = dict.work;

  return (
    <Section
      id="work"
      label={w.label}
      title={w.title}
      description={w.description}
      className="border-t border-border/50"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={scaleIn}
        className="overflow-hidden rounded-3xl border border-border bg-surface"
      >
        <a
          href={TSM_PROJECT_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={w.visitSiteAria}
          className="group block w-full overflow-hidden bg-[#050505]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/projects/tsm-hero.png"
            srcSet="/projects/tsm-hero.png 1x, /projects/tsm-hero@2x.png 2x"
            alt={w.title}
            width={1024}
            height={455}
            decoding="async"
            fetchPriority="high"
            className="block aspect-[1024/455] h-auto w-full object-cover object-top"
          />
        </a>

        <div className="border-b border-border bg-surface px-5 py-5 sm:px-8 sm:py-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            {w.caseStudy}
          </p>
          <h3 className="mt-2 font-display text-2xl font-semibold text-foreground sm:text-3xl">
            {w.title}
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-foreground-subtle sm:text-base">
            {w.subtitle}
          </p>
          <a
            href={TSM_PROJECT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gradient transition-opacity hover:opacity-80"
          >
            {w.visitSite}
            <ExternalLinkIcon />
          </a>
        </div>

        <div className="border-t border-border p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
            <div className="lg:flex-1">
              <motion.div variants={fadeUp} className="mb-4 flex flex-wrap gap-2">
                {w.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-surface-elevated px-3 py-1 text-xs text-foreground-subtle"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>
              <p className="text-sm leading-relaxed text-muted lg:text-base">{w.body}</p>

              <p className="mt-6 font-mono text-xs uppercase tracking-wider text-muted">
                {w.stackLabel}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {w.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg border border-border bg-background px-2.5 py-1 font-mono text-[11px] text-foreground-subtle"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              className="flex flex-col gap-3 lg:max-w-md lg:flex-1"
            >
              {w.features.map((feature, i) => (
                <motion.li
                  key={feature}
                  variants={fadeUp}
                  custom={i}
                  className="flex gap-3 text-sm leading-relaxed text-foreground-subtle"
                >
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gradient-accent" />
                  {feature}
                </motion.li>
              ))}
            </motion.ul>
          </div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-8 flex flex-col gap-3 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex flex-col gap-2">
              <a
                href={TSM_PROJECT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-sm text-foreground-subtle transition-colors hover:text-foreground"
              >
                transportservicemedellin.com
                <ExternalLinkIcon />
              </a>
              <a
                href={TSM_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={w.visitInstagramAria}
                className="inline-flex items-center gap-2 text-sm text-foreground-subtle transition-colors hover:text-foreground"
              >
                <InstagramIcon />
                @transportservice_medellin
                <ExternalLinkIcon />
              </a>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <GradientButton href={TSM_PROJECT_URL} external>
                {w.visitSite}
              </GradientButton>
              <GradientButton href={TSM_INSTAGRAM_URL} variant="secondary" external>
                {w.visitInstagram}
              </GradientButton>
              <GradientButton href={getLeadWhatsAppUrl(dict.leads.messages, "work")} external>
                {w.cta}
              </GradientButton>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Section>
  );
}
