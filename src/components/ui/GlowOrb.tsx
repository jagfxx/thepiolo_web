"use client";

import { motion } from "framer-motion";

type GlowOrbProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: "h-48 w-48",
  md: "h-72 w-72",
  lg: "h-96 w-96 sm:h-[28rem] sm:w-[28rem]",
};

export function GlowOrb({ className = "", size = "md" }: GlowOrbProps) {
  return (
    <motion.div
      aria-hidden
      animate={{
        scale: [1, 1.08, 1],
        opacity: [0.4, 0.55, 0.4],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`pointer-events-none absolute rounded-full blur-[100px] ${sizes[size]} ${className}`}
      style={{
        background:
          "radial-gradient(circle, rgba(180,64,255,0.35) 0%, rgba(255,113,228,0.15) 40%, transparent 70%)",
      }}
    />
  );
}
