"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { useLanguage } from "@/lib/i18n/context";
import { fadeUp, staggerContainer } from "@/lib/motion";

export function Process() {
  const { dict } = useLanguage();
  const p = dict.process;

  return (
    <Section
      id="process"
      label={p.label}
      title={p.title}
      description={p.description}
      className="border-t border-border/50"
    >
      <motion.ol
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="relative space-y-0"
      >
        <div
          aria-hidden
          className="absolute left-[1.15rem] top-8 hidden h-[calc(100%-4rem)] w-px bg-gradient-to-b from-[#b440ff]/40 via-[#ff71e4]/30 to-transparent lg:left-1/2 lg:block lg:-translate-x-px"
        />

        {p.steps.map((step, i) => (
          <motion.li
            key={step.step}
            variants={fadeUp}
            custom={i}
            className={`relative flex flex-col gap-6 pb-12 lg:flex-row lg:items-center lg:gap-16 lg:pb-16 ${
              i % 2 === 1 ? "lg:flex-row-reverse" : ""
            }`}
          >
            <div className="flex flex-1 items-start gap-5 lg:justify-end lg:text-right">
              {i % 2 === 0 && <div className="hidden flex-1 lg:block" aria-hidden />}
              <div
                className={`flex flex-1 flex-col ${
                  i % 2 === 1 ? "lg:items-start lg:text-left" : "lg:items-end"
                }`}
              >
                <span className="font-mono text-sm text-gradient">{step.step}</span>
                <h3 className="mt-1 font-display text-xl font-medium text-foreground sm:text-2xl">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
                  {step.description}
                </p>
              </div>
            </div>

            <div
              className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface-elevated lg:absolute lg:left-1/2 lg:-translate-x-1/2"
              aria-hidden
            >
              <span className="h-2 w-2 rounded-full bg-gradient-accent" />
            </div>

            <div className="hidden flex-1 lg:block" aria-hidden />
          </motion.li>
        ))}
      </motion.ol>
    </Section>
  );
}
