"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import { SectionHeading } from "@/components/SectionHeading";
import { galleryImages } from "@/lib/images";

export function Gallery() {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight")
        setActive((i) => (i === null ? null : (i + 1) % galleryImages.length));
      if (e.key === "ArrowLeft")
        setActive((i) =>
          i === null
            ? null
            : (i - 1 + galleryImages.length) % galleryImages.length,
        );
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active === null, close]);

  return (
    <section id="galerija" className="scroll-mt-20 bg-cream-50 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Galerija"
          title="Pogled na vaš odmor"
          description="Bazen, livada, šuma i ugodan enterijer — kliknite na sliku za uvećan prikaz."
        />

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {galleryImages.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setActive(i)}
              className="group relative aspect-[4/3] overflow-hidden rounded focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-pine-950/70 to-transparent px-3 pb-2 pt-8 text-left text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                {img.category}
              </span>
            </button>
          ))}
        </div>
      </div>

      {active !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={galleryImages[active].alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-pine-950/90 p-4"
          onClick={close}
        >
          <button
            type="button"
            aria-label="Zatvori"
            onClick={close}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            type="button"
            aria-label="Prethodna slika"
            onClick={(e) => {
              e.stopPropagation();
              setActive((active - 1 + galleryImages.length) % galleryImages.length);
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 sm:left-4"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <figure
            className="max-h-[85vh] w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={galleryImages[active].src}
                alt={galleryImages[active].alt}
                fill
                sizes="(max-width: 896px) 100vw, 896px"
                className="rounded object-contain"
              />
            </div>
            <figcaption className="mt-3 text-center text-sm text-white/80">
              {galleryImages[active].alt} · {active + 1} / {galleryImages.length}
            </figcaption>
          </figure>
          <button
            type="button"
            aria-label="Sljedeća slika"
            onClick={(e) => {
              e.stopPropagation();
              setActive((active + 1) % galleryImages.length);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 sm:right-4"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </section>
  );
}
