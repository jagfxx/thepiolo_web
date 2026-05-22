"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { useLanguage } from "@/lib/i18n/context";
import { fadeUp, staggerContainer } from "@/lib/motion";

export function About() {
  const { dict } = useLanguage();
  const a = dict.about;

  return (
    <Section id="about" label={a.label} title={a.title} description={a.description}>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {a.highlights.map((item, i) => (
          <motion.article
            key={item.title}
            variants={fadeUp}
            custom={i}
            className={`group rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-border-hover hover:bg-surface-elevated ${
              i === 4 ? "sm:col-span-2 lg:col-span-1" : ""
            }`}
          >
            <div className="mb-4 h-px w-8 bg-gradient-accent opacity-70 transition-all group-hover:w-12" />
            <h3 className="font-display text-lg font-medium text-foreground">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {item.description}
            </p>
          </motion.article>
        ))}
      </motion.div>
    </Section>
  );
}
