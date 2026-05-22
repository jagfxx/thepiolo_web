"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { useLanguage } from "@/lib/i18n/context";
import { fadeUp, staggerContainer } from "@/lib/motion";

export function Services() {
  const { dict } = useLanguage();
  const s = dict.services;

  return (
    <Section
      id="services"
      label={s.label}
      title={s.title}
      description={s.description}
      className="border-t border-border/50"
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {s.items.map((service, i) => (
          <motion.article
            key={service.title}
            variants={fadeUp}
            custom={i}
            className="border-gradient group rounded-2xl p-6 sm:p-7"
          >
            <span className="font-mono text-xs text-muted">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-3 font-display text-xl font-medium text-foreground">
              {service.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {service.description}
            </p>
          </motion.article>
        ))}
      </motion.div>
    </Section>
  );
}
