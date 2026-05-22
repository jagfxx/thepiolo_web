import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  title: "THEPIOLO — Premium Digital Web Studio",
  description:
    "THEPIOLO is a modern web studio crafting premium digital experiences—web design, development, branding, and deployment for ambitious brands.",
  keywords: [
    "THEPIOLO",
    "web studio",
    "web developer",
    "UI/UX",
    "branding",
    "landing pages",
    "Medellín",
    "digital agency",
  ],
  authors: [{ name: "THEPIOLO" }],
  openGraph: {
    title: "THEPIOLO — Premium Digital Web Studio",
    description:
      "Premium digital experiences at the intersection of engineering, design, and brand.",
    type: "website",
    locale: "en_US",
    siteName: "THEPIOLO",
  },
  twitter: {
    card: "summary_large_image",
    title: "THEPIOLO — Premium Digital Web Studio",
    description:
      "Premium digital experiences at the intersection of engineering, design, and brand.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${syne.variable}`}>
      <body className="min-h-screen overflow-x-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
