"use client";

import { motion } from "framer-motion";
import { fadeUp, scaleIn } from "@/lib/motion";
import { useLanguage } from "@/lib/i18n/context";
import { GradientButton } from "@/components/ui/GradientButton";
import { GlowOrb } from "@/components/ui/GlowOrb";

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
          className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
        >
          {c.titleBefore}{" "}
          <span className="text-gradient">{c.titleHighlight}</span>
        </motion.h2>
        <motion.p
          variants={fadeUp}
          custom={2}
          className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted sm:text-lg"
        >
          {c.description}
        </motion.p>

        <motion.div
          variants={fadeUp}
          custom={3}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <GradientButton href="mailto:hello@thepiolo.com" external>
            hello@thepiolo.com
          </GradientButton>
          <GradientButton href="https://github.com" variant="secondary" external>
            GitHub
          </GradientButton>
        </motion.div>

        <motion.p variants={fadeUp} custom={4} className="mt-8 text-xs text-muted">
          {c.responseTime}
        </motion.p>
      </motion.div>
    </section>
  );
}
