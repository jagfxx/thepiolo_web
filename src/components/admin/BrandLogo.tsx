import Image from "next/image";
import Link from "next/link";
import { brandAssets } from "@/lib/brand-assets";

type BrandLogoProps = {
  variant?: "full" | "mark" | "compact";
  size?: "sm" | "md" | "lg" | "hero";
  href?: string;
  className?: string;
  subtitle?: string;
  priority?: boolean;
};

const fullSizes = {
  sm: { width: 160, height: 46, className: "h-9 w-auto max-w-[160px]" },
  md: { width: 200, height: 56, className: "h-10 w-auto max-w-[200px]" },
  lg: { width: 240, height: 68, className: "h-12 w-auto max-w-[240px]" },
  hero: { width: 280, height: 80, className: "h-14 w-auto max-w-[280px] sm:h-16" },
} as const;

const markSizes = {
  sm: { size: 32, className: "h-8 w-8" },
  md: { size: 36, className: "h-9 w-9" },
  lg: { size: 44, className: "h-11 w-11" },
  hero: { size: 48, className: "h-12 w-12" },
} as const;

export function BrandLogo({
  variant = "full",
  size = "md",
  href,
  className = "",
  subtitle,
  priority = false,
}: BrandLogoProps) {
  const full = fullSizes[size];
  const mark = markSizes[size];

  const content =
    variant === "full" ? (
      <Image
        src={brandAssets.full}
        alt="THEPIOLO"
        width={full.width}
        height={full.height}
        className={full.className}
        priority={priority}
      />
    ) : variant === "mark" ? (
      <Image
        src={brandAssets.mark}
        alt="THEPIOLO"
        width={mark.size}
        height={mark.size}
        className={mark.className}
        priority={priority}
      />
    ) : (
      <div className="flex items-center gap-2.5">
        <Image
          src={brandAssets.mark}
          alt=""
          width={mark.size}
          height={mark.size}
          className={mark.className}
          aria-hidden
          priority={priority}
        />
        <div className="flex flex-col">
          <span className="font-display text-sm font-semibold tracking-wide text-foreground sm:text-base">
            THEPIOLO
          </span>
          {subtitle ? (
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted sm:text-xs">
              {subtitle}
            </span>
          ) : null}
        </div>
      </div>
    );

  const wrapperClass = `inline-flex shrink-0 items-center ${className}`;

  if (href) {
    return (
      <Link href={href} className={wrapperClass}>
        {content}
      </Link>
    );
  }

  return <div className={wrapperClass}>{content}</div>;
}
