/**
 * Centralni sadržaj sajta — učitava se iz content/site-data.json.
 * Taj JSON je jedini izvor istine: uređuje se kroz /admin chat
 * (Gemini + GitHub commit) ili ručno, a sajt ga učitava pri buildu.
 */
import data from "../../content/site-data.json";

export interface GalleryImage {
  src: string;
  alt: string;
  category: string;
}

export type PackageTheme = "pine" | "navy" | "gold";

export interface SitePackage {
  id: string;
  name: string;
  capacity: number;
  theme: PackageTheme;
  badge?: string;
  weekdayPrice: string;
  weekendPrice: string;
  deposit: string;
  note: string;
}

export interface SiteData {
  name: string;
  slogan: string;
  tagline: string;
  hours: string;
  cta: string;
  contact: {
    phoneDisplay: string;
    phoneIntl: string;
  };
  hero: {
    title: string;
    subtitle: string;
    highlights: string[];
    intro: string;
    heatingBadge: { title: string; text: string };
    advantages: string[];
  };
  overnight: {
    title: string;
    description: string;
    capacity: { guests: number; bedrooms: number; bathrooms: number; estateSize: string };
    pricing: { label: string; price: string }[];
    houseRules: { checkIn: string; checkOut: string; notes: string[] };
  };
  location: {
    title: string;
    description: string;
    distances: { label: string; value: string }[];
    mapEmbedUrl: string;
    mapsLink: string;
  };
  amenities: string[];
  packages: SitePackage[];
  premiumIncludes: string[];
  drinksService: {
    title: string;
    text: string;
    available: string[];
    condition: string;
    note: string;
    message: string;
  };
  rules: {
    title: string;
    highlight?: string;
    items: string[];
    footer?: string;
  }[];
  finale: {
    title: string;
    text: string;
    signature: string;
    closers: string[];
  };
  footerRules: string[];
  images: {
    hero: { src: string; alt: string };
    finale: { src: string; alt: string };
    gallery: GalleryImage[];
  };
}

export const site = data as SiteData;

export const heroImage = site.images.hero;
export const finaleImage = site.images.finale;
export const galleryImages = site.images.gallery;
