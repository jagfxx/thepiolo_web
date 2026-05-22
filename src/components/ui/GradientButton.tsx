"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type GradientButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  external?: boolean;
};

export function GradientButton({
  href,
  children,
  variant = "primary",
  external = false,
}: GradientButtonProps) {
  const base =
    "relative inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 sm:px-8 sm:py-3.5 sm:text-base";

  const className =
    variant === "primary"
      ? `${base} bg-gradient-accent text-white glow-accent hover:brightness-110 hover:shadow-[0_0_50px_rgba(180,64,255,0.25)]`
      : `${base} glass text-foreground hover:border-border-hover hover:bg-surface-elevated`;

  const content = (
    <motion.span
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      {children}
    </motion.span>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return <Link href={href}>{content}</Link>;
}
