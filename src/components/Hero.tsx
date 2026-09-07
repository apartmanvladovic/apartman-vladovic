import { CalendarCheck, Images } from "lucide-react";
import Image from "next/image";

import { site } from "@/config/site";
import { heroImage } from "@/lib/images";

export function Hero() {
  return (
    <section id="vrh" className="relative flex min-h-[92vh] items-center">
      <Image
        src={heroImage.src}
        alt={heroImage.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-forest-950/70 via-forest-950/40 to-forest-950/70" />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-32 text-center sm:px-6">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-forest-200">
          Podnožje planine Igman
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
          {site.name}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/85 sm:text-xl">
          {site.tagline}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#kalendar"
            className="inline-flex items-center gap-2 rounded-full bg-amber-700 px-7 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-orange-700"
          >
            <CalendarCheck className="h-5 w-5" aria-hidden />
            Provjeri dostupnost
          </a>
          <a
            href="#galerija"
            className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-7 py-3 font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
          >
            <Images className="h-5 w-5" aria-hidden />
            Pogledaj galeriju
          </a>
        </div>
      </div>
    </section>
  );
}
