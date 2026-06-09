"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { portfolioProjects } from "@/lib/data";
import { getLeadWhatsAppUrl } from "@/lib/leads";
import { useLanguage } from "@/lib/i18n/context";
import type { Dictionary } from "@/lib/i18n/types";
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

type WorkProject = Dictionary["work"]["projects"][number];

function PortfolioCard({
  project,
  labels,
  leadsMessages,
}: {
  project: WorkProject;
  labels: Dictionary["work"];
  leadsMessages: Dictionary["leads"]["messages"];
}) {
  const meta = portfolioProjects.find((item) => item.id === project.id);
  if (!meta) return null;

  const { image } = meta;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={scaleIn}
      className="overflow-hidden rounded-3xl border border-border bg-surface"
    >
      <a
        href={meta.siteUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={project.visitSiteAria}
        className="group block w-full overflow-hidden bg-[#050505]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.src}
          srcSet={
            "src2x" in image && image.src2x
              ? `${image.src} 1x, ${image.src2x} 2x`
              : undefined
          }
          alt={project.title}
          width={image.width}
          height={image.height}
          decoding="async"
          style={{ aspectRatio: `${image.width} / ${image.height}` }}
          className="block h-auto w-full object-cover object-top"
        />
      </a>

      <div className="border-b border-border bg-surface px-5 py-5 sm:px-8 sm:py-6">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          {labels.caseStudy}
        </p>
        <h3 className="mt-2 font-display text-2xl font-semibold text-foreground sm:text-3xl">
          {project.title}
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-foreground-subtle sm:text-base">
          {project.subtitle}
        </p>
        <a
          href={meta.siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gradient transition-opacity hover:opacity-80"
        >
          {labels.visitSite}
          <ExternalLinkIcon />
        </a>
      </div>

      <div className="border-t border-border p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          <div className="lg:flex-1">
            <motion.div variants={fadeUp} className="mb-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-surface-elevated px-3 py-1 text-xs text-foreground-subtle"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
            <p className="text-sm leading-relaxed text-muted lg:text-base">{project.body}</p>

            <p className="mt-6 font-mono text-xs uppercase tracking-wider text-muted">
              {labels.stackLabel}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
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
            {project.features.map((feature, i) => (
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
              href={meta.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-sm text-foreground-subtle transition-colors hover:text-foreground"
            >
              {meta.siteDisplay}
              <ExternalLinkIcon />
            </a>
            <a
              href={meta.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={project.visitInstagramAria}
              className="inline-flex items-center gap-2 text-sm text-foreground-subtle transition-colors hover:text-foreground"
            >
              <InstagramIcon />
              {meta.instagramDisplay}
              <ExternalLinkIcon />
            </a>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <GradientButton href={meta.siteUrl} external>
              {labels.visitSite}
            </GradientButton>
            <GradientButton href={meta.instagramUrl} variant="secondary" external>
              {labels.visitInstagram}
            </GradientButton>
            <GradientButton href={getLeadWhatsAppUrl(leadsMessages, "work")} external>
              {labels.cta}
            </GradientButton>
          </div>
        </motion.div>
      </div>
    </motion.div>
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
      <div className="flex flex-col gap-10 lg:gap-14">
        {w.projects.map((project) => (
          <PortfolioCard
            key={project.id}
            project={project}
            labels={w}
            leadsMessages={dict.leads.messages}
          />
        ))}
      </div>
    </Section>
  );
}
