import type { Metadata } from "next";
import { Figtree, Playfair_Display } from "next/font/google";

import { site } from "@/config/site";
import { heroImage } from "@/lib/images";

import "./globals.css";

const figtree = Figtree({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-figtree",
});

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: {
    default: `${site.name} — Privatni bazen za dnevni najam, 20 min od Sarajeva`,
    template: `%s | ${site.name}`,
  },
  description: `${site.slogan} Dnevni najam i noćenje u privatnoj vikendici sa bazenom, ${site.tagline}. Bazen sa grijanjem, roštilj, šadrvan, mali nogomet i potpuna privatnost.`,
  keywords: [
    "vikendica",
    "bazen",
    "dnevni najam",
    "Sarajevo",
    "privatni bazen",
    "proslava",
    "roštilj",
  ],
  openGraph: {
    type: "website",
    locale: "bs_BA",
    siteName: site.name,
    title: site.hero.title,
    description: site.slogan,
    images: [{ url: heroImage.src, width: 2000, height: 1125, alt: heroImage.alt }],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bs" className={`${figtree.variable} ${playfair.variable}`}>
      <body className="bg-cream-50 font-sans text-pine-950 antialiased">
        {children}
      </body>
    </html>
  );
}
