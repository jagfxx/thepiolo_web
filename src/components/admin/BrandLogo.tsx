import Image from "next/image";
import Link from "next/link";
import { brandAssets } from "@/lib/brand-assets";

type BrandLogoProps = {
  /** full = logo transparente + texto; mark = solo ícono; banner = SVG con fondo (evitar en admin) */
  variant?: "full" | "mark" | "banner";
  size?: "sm" | "md" | "lg" | "hero";
  href?: string;
  className?: string;
  subtitle?: string;
  priority?: boolean;
};

const markSizes = {
  sm: { size: 32, className: "h-8 w-8" },
  md: { size: 40, className: "h-10 w-10" },
  lg: { size: 52, className: "h-[52px] w-[52px]" },
  hero: { size: 64, className: "h-16 w-16" },
} as const;

const textSizes = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-xl",
  hero: "text-2xl sm:text-3xl",
} as const;

const bannerSizes = {
  sm: { width: 160, height: 46, className: "h-9 w-auto max-w-[160px]" },
  md: { width: 200, height: 56, className: "h-10 w-auto max-w-[200px]" },
  lg: { width: 240, height: 68, className: "h-12 w-auto max-w-[240px]" },
  hero: { width: 280, height: 80, className: "h-14 w-auto max-w-[280px] sm:h-16" },
} as const;

export function BrandLogo({
  variant = "full",
  size = "md",
  href,
  className = "",
  subtitle,
  priority = false,
}: BrandLogoProps) {
  const mark = markSizes[size];

  let content: React.ReactNode;

  if (variant === "banner") {
    const banner = bannerSizes[size];
    content = (
      <Image
        src={brandAssets.full}
        alt="THEPIOLO"
        width={banner.width}
        height={banner.height}
        className={banner.className}
        priority={priority}
      />
    );
  } else if (variant === "mark") {
    content = (
      <Image
        src={brandAssets.mark}
        alt="THEPIOLO"
        width={mark.size}
        height={mark.size}
        className={mark.className}
        priority={priority}
      />
    );
  } else {
    content = (
      <div className="flex items-center gap-3">
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
          <span
            className={`font-display font-semibold tracking-wide text-gradient ${textSizes[size]}`}
          >
            THEPIOLO
          </span>
          {subtitle ? (
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted sm:text-xs">
              {subtitle}
            </span>
          ) : null}
        </div>
      </div>
    );
  }

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
