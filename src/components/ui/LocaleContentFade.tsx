"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/context";

export function LocaleContentFade({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { isTransitioning } = useLanguage();
  const reduceMotion = useReducedMotion();

  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <motion.div
      className={className}
      animate={{
        opacity: isTransitioning ? 0.15 : 1,
        filter: isTransitioning ? "blur(8px)" : "blur(0px)",
        y: isTransitioning ? 4 : 0,
      }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
