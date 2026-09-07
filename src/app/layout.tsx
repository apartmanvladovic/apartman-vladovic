import type { Metadata } from "next";
import { Figtree } from "next/font/google";

import { site } from "@/config/site";
import { heroImage } from "@/lib/images";

import "./globals.css";

const figtree = Figtree({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-figtree",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: {
    default: `${site.name} — Planinski odmor sa privatnim bazenom`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "apartman",
    "Igman",
    "bazen",
    "planinski odmor",
    "Sarajevo",
    "smještaj",
    "Vrelo Bosne",
  ],
  openGraph: {
    type: "website",
    locale: "bs_BA",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [{ url: heroImage.src, width: 1200, height: 900, alt: heroImage.alt }],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bs" className={figtree.variable}>
      <body className="bg-mist-50 font-sans text-brand-950 antialiased">
        {children}
      </body>
    </html>
  );
}
