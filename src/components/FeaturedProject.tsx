"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { TSM_INSTAGRAM_URL, TSM_PROJECT_URL } from "@/lib/data";
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
          className="group relative block w-full overflow-hidden bg-black"
        >
          <div className="relative mx-auto aspect-[1024/482] w-full max-w-[1024px]">
            <Image
              src="/projects/tsm-preview.png"
              alt={w.title}
              fill
              unoptimized
              className="object-contain object-center"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#13131e] via-[#13131e]/25 to-transparent" />

          <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto max-w-[1024px]">
            <div className="absolute left-5 top-5 sm:left-8 sm:top-8">
              <div className="rounded-xl border border-border/80 bg-surface/90 p-2.5 backdrop-blur-md">
                <Image
                  src="/projects/tsm-logo.svg"
                  alt=""
                  width={120}
                  height={40}
                  className="h-8 w-auto sm:h-9"
                  aria-hidden
                />
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto max-w-[1024px] p-5 sm:p-8">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
              {w.caseStudy}
            </p>
            <h3 className="mt-2 font-display text-2xl font-semibold text-foreground sm:text-3xl lg:text-4xl">
              {w.title}
            </h3>
            <p className="mt-2 max-w-xl text-sm text-foreground-subtle sm:text-base">
              {w.subtitle}
            </p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gradient opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {w.visitSite}
              <ExternalLinkIcon />
            </span>
          </div>
        </a>

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
              <GradientButton href="#contact" variant="secondary">
                {w.cta}
              </GradientButton>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Section>
  );
}
