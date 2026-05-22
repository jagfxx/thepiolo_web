import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
import { Providers } from "@/components/Providers";
import { JsonLd } from "@/components/JsonLd";
import { siteMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
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

export const metadata: Metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${dmSans.variable} ${syne.variable}`}>
      <head>
        <link rel="me" href={siteConfig.instagram.url} />
      </head>
      <body className="min-h-screen overflow-x-hidden">
        <JsonLd />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
