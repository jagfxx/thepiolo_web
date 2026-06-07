"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { useLanguage } from "@/lib/i18n/context";
import { getLeadWhatsAppUrl } from "@/lib/leads";
import { GradientButton } from "@/components/ui/GradientButton";
import { GridBackground } from "@/components/ui/GridBackground";
import { GlowOrb } from "@/components/ui/GlowOrb";

export function Hero() {
  const { dict } = useLanguage();
  const h = dict.hero;

  return (
    <section className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden px-5 pb-20 pt-28 sm:px-8 sm:pt-32">
      <GridBackground />
      <GlowOrb className="left-1/2 top-1/4 -translate-x-1/2" size="lg" />
      <GlowOrb className="right-0 top-1/2 opacity-50" size="md" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center text-center lg:items-start lg:text-left"
      >
        <motion.div variants={fadeUp} custom={0} className="mb-8">
          <Image
            src="/THEPIOLO-05.svg"
            alt={h.logoAlt}
            width={280}
            height={80}
            className="mx-auto h-14 w-auto sm:h-16 lg:mx-0 lg:h-[4.5rem]"
            priority
          />
        </motion.div>

        <motion.p
          variants={fadeUp}
          custom={1}
          className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-muted sm:text-sm"
        >
          {h.tagline}
        </motion.p>

        <motion.h1
          variants={fadeUp}
          custom={2}
          className="font-display text-[2.25rem] font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:max-w-4xl lg:text-[3.5rem]"
        >
          {h.headlineBefore}{" "}
          <span className="text-gradient">{h.headlineHighlight}</span>
          <br className="hidden sm:block" /> {h.headlineAfter}
        </motion.h1>

        <motion.p
          variants={fadeUp}
          custom={3}
          className="mt-6 max-w-xl text-base leading-relaxed text-foreground-subtle sm:text-lg lg:max-w-lg"
        >
          {h.description}
        </motion.p>

        <motion.div
          variants={fadeUp}
          custom={4}
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start"
        >
          <GradientButton href={getLeadWhatsAppUrl(dict.leads.messages, "hero")} external>
            {h.ctaPrimary}
          </GradientButton>
          <GradientButton href="#plans" variant="secondary">
            {h.ctaSecondary}
          </GradientButton>
        </motion.div>

        <motion.div
          variants={fadeUp}
          custom={5}
          className="mt-16 flex flex-wrap items-center justify-center gap-6 text-xs text-muted lg:justify-start"
        >
          {h.pills.map((item) => (
            <span key={item} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-gradient-accent" />
              {item}
            </span>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 sm:block"
        aria-hidden
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-10 w-6 items-start justify-center rounded-full border border-border p-1.5"
        >
          <div className="h-2 w-1 rounded-full bg-muted" />
        </motion.div>
      </motion.div>
    </section>
  );
}
