"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";

type SectionProps = {
  id?: string;
  label: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function Section({
  id,
  label,
  title,
  description,
  children,
  className = "",
}: SectionProps) {
  return (
    <section id={id} className={`relative px-5 py-24 sm:px-8 sm:py-32 lg:py-40 ${className}`}>
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="mb-14 sm:mb-16 lg:mb-20"
        >
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
            {label}
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          {description && (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground-subtle sm:text-lg">
              {description}
            </p>
          )}
        </motion.div>
        {children}
      </div>
    </section>
  );
}
