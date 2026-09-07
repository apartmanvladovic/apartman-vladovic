import Image from "next/image";

import { finaleImage, site } from "@/lib/content";

export function Finale() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <Image
        src={finaleImage.src}
        alt={finaleImage.alt}
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-pine-950/75" />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="font-display text-4xl font-semibold text-gold-light sm:text-5xl">
          {site.finale.title}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-cream-50/90">
          {site.finale.text}
        </p>
        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-gold">
          {site.finale.signature}
        </p>
        <div className="mt-6 space-y-1.5">
          {site.finale.closers.map((c) => (
            <p key={c} className="font-display text-lg italic text-cream-50/85">
              {c}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
