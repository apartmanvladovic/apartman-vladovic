import { CalendarCheck, Images } from "lucide-react";
import Image from "next/image";

import { site } from "@/config/site";
import { heroImage } from "@/lib/images";

export function Hero() {
  return (
    <section id="vrh" className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:gap-16">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Kuća sa privatnim bazenom · Igman
        </p>
        <h1 className="mt-5 text-5xl font-light leading-[1.05] tracking-tight text-brand-700 sm:text-6xl">
          {site.name}
        </h1>
        <p className="mt-6 max-w-lg text-lg leading-relaxed text-brand-950/70">
          {site.tagline}. Mir, svjež planinski zrak i privatni bazen u vlastitom
          dvorištu, okružen livadom i borovom šumom. Cijeli objekat je vaš za
          vrijeme boravka.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <a
            href="#kalendar"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
          >
            <CalendarCheck className="h-4 w-4" aria-hidden />
            Provjeri dostupnost
          </a>
          <a
            href="#galerija"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-950/15 px-7 py-3.5 text-sm font-semibold text-brand-700 transition-colors hover:border-brand-700"
          >
            <Images className="h-4 w-4" aria-hidden />
            Pogledaj galeriju
          </a>
        </div>
      </div>

      <div className="relative aspect-[4/3] overflow-hidden rounded shadow-xl">
        <Image
          src={heroImage.src}
          alt={heroImage.alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}
