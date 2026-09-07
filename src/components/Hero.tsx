import { Check, Phone, ThermometerSun } from "lucide-react";
import Image from "next/image";

import { heroImage, site } from "@/lib/content";

export function Hero() {
  return (
    <section id="vrh" className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-14">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-navy-600">
          {site.hero.subtitle}
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.1] text-pine-700 sm:text-5xl">
          {site.hero.title}
        </h1>

        <div className="mt-6 space-y-1.5">
          {site.hero.highlights.map((h) => (
            <p key={h} className="text-sm font-bold uppercase tracking-wide text-gold-dark">
              {h}
            </p>
          ))}
        </div>

        <p className="mt-5 max-w-lg leading-relaxed text-pine-950/75">
          {site.hero.intro}
        </p>

        <div className="mt-6 inline-flex items-start gap-3 rounded border border-gold/40 bg-gold/10 px-5 py-4">
          <ThermometerSun className="mt-0.5 h-6 w-6 shrink-0 text-gold-dark" aria-hidden />
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-pine-800">
              {site.hero.heatingBadge.title}
            </p>
            <p className="mt-1 text-sm text-pine-950/70">
              {site.hero.heatingBadge.text}
            </p>
          </div>
        </div>

        <ul className="mt-6 space-y-2">
          {site.hero.advantages.map((a) => (
            <li key={a} className="flex items-center gap-2.5 text-sm font-medium text-pine-950/80">
              <Check className="h-4 w-4 shrink-0 text-pine-500" aria-hidden />
              {a}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <a
            href="#kontakt"
            className="inline-flex items-center justify-center rounded-full bg-gold px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-pine-950 shadow-md transition-colors hover:bg-gold-light"
          >
            {site.cta}
          </a>
          <a
            href={`tel:+${site.contact.phoneIntl}`}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-pine-950/20 px-7 py-3.5 text-sm font-semibold text-pine-700 transition-colors hover:border-pine-700"
          >
            <Phone className="h-4 w-4" aria-hidden />
            {site.contact.phoneDisplay}
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
