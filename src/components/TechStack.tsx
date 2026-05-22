"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { technologies } from "@/lib/data";
import { useLanguage } from "@/lib/i18n/context";
import { fadeUp, staggerContainer } from "@/lib/motion";

export function TechStack() {
  const { dict } = useLanguage();
  const s = dict.stack;

  return (
    <Section
      id="stack"
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
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4"
      >
        {technologies.map((tech, i) => (
          <motion.div
            key={tech.name}
            variants={fadeUp}
            custom={i}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="group flex flex-col items-center justify-center rounded-2xl border border-border bg-surface px-4 py-8 text-center transition-colors hover:border-border-hover hover:bg-surface-elevated"
          >
            <span className="font-display text-lg font-medium text-foreground transition-colors group-hover:text-gradient sm:text-xl">
              {tech.name}
            </span>
            <span className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted">
              {s.categories[tech.categoryKey]}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
