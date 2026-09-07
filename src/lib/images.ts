/**
 * Placeholder fotografije (Unsplash) — zamijenite pravim slikama.
 *
 * Prave slike stavite u public/images/ (npr. public/images/bazen.jpg)
 * i ovdje zamijenite "src" sa "/images/bazen.jpg".
 */

export interface GalleryImage {
  src: string;
  alt: string;
  category: string;
}

const unsplash = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const heroImage = {
  src: unsplash("photo-1470770841072-f978cf4d019e", 2000),
  alt: "Planinska kuća okružena zelenilom i šumom",
};

export const galleryImages: GalleryImage[] = [
  {
    src: unsplash("photo-1572331165267-854da2b10ccc"),
    alt: "Privatni bazen na otvorenom okružen travnjakom",
    category: "Bazen i dvorište",
  },
  {
    src: unsplash("photo-1449158743715-0a90ebb6d2d8"),
    alt: "Eksterijer kuće na livadi podno planine",
    category: "Eksterijer",
  },
  {
    src: unsplash("photo-1441974231531-c6227db76b6e"),
    alt: "Borova šuma koja okružuje imanje",
    category: "Okruženje",
  },
  {
    src: unsplash("photo-1586023492125-27b2c045efd7"),
    alt: "Ugodan dnevni boravak sa drvenim detaljima",
    category: "Dnevni boravak",
  },
  {
    src: unsplash("photo-1556911220-bff31c812dba"),
    alt: "Potpuno opremljena kuhinja",
    category: "Kuhinja",
  },
  {
    src: unsplash("photo-1540518614846-7eded433c457"),
    alt: "Spavaća soba sa pogledom na zelenilo",
    category: "Spavaće sobe",
  },
  {
    src: unsplash("photo-1507089947368-19c1da9775ae"),
    alt: "Terasa sa pogledom na šumu i planinu",
    category: "Terasa",
  },
  {
    src: unsplash("photo-1540541338287-41700207dee6"),
    alt: "Kupanje i opuštanje uz bazen",
    category: "Bazen i dvorište",
  },
  {
    src: unsplash("photo-1470071459604-3b5ec3a7fe05"),
    alt: "Jutarnja magla nad livadama Igmana",
    category: "Okruženje",
  },
];
