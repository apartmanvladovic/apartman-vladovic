/**
 * Placeholder fotografije (Unsplash) — zamijenite pravim slikama.
 * Prave slike stavite u public/images/ i ovdje promijenite "src".
 */

const unsplash = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const heroImage = {
  src: unsplash("photo-1572331165267-854da2b10ccc", 2000),
  alt: "Privatni bazen okružen zelenilom",
};

export const finaleImage = {
  src: unsplash("photo-1540541338287-41700207dee6", 2000),
  alt: "Opuštanje uz bazen u prirodi",
};
