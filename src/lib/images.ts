/**
 * Fotografije objekta u public/images/ — zamijenite pravim slikama
 * istih naziva fajlova (ili promijenite putanje ovdje).
 */

export interface GalleryImage {
  src: string;
  alt: string;
  category: string;
}

export const heroImage = {
  src: "/images/hero.jpg",
  alt: "Kuća i bazen u dvorištu",
};

export const finaleImage = {
  src: "/images/dvoriste-vece.jpg",
  alt: "Dvorište u večernjim satima",
};

export const galleryImages: GalleryImage[] = [
  { src: "/images/bazen-1.jpg", alt: "Privatni bazen na otvorenom", category: "Bazen" },
  { src: "/images/bazen-2.jpg", alt: "Bazen s ležaljkama i suncobranima", category: "Bazen" },
  { src: "/images/terasa-rostilj.jpg", alt: "Terasa s roštiljem", category: "Terasa i roštilj" },
  { src: "/images/rostilj.jpg", alt: "Zidani roštilj", category: "Terasa i roštilj" },
  { src: "/images/terasa.jpg", alt: "Terasa u zelenilu", category: "Terasa i roštilj" },
  { src: "/images/dvoriste.jpg", alt: "Roštilnica i uređeno dvorište", category: "Dvorište" },
];
