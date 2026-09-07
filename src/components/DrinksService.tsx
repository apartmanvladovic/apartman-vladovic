import { BellRing, GlassWater } from "lucide-react";

import { site } from "@/config/site";

export function DrinksService() {
  const d = site.drinksService;

  return (
    <section className="bg-navy-700 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <GlassWater className="mx-auto h-10 w-10 text-gold-light" aria-hidden />
        <h2 className="mt-5 font-display text-3xl font-semibold leading-tight text-cream-50 sm:text-4xl">
          {d.title}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-cream-50/80">
          {d.text}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-2.5">
          {d.available.map((a) => (
            <span
              key={a}
              className="rounded-full border border-cream-50/25 px-4 py-2 text-sm font-medium text-cream-50"
            >
              {a}
            </span>
          ))}
        </div>

        <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold/15 px-5 py-2.5 text-sm font-semibold text-gold-light">
          <BellRing className="h-4 w-4" aria-hidden />
          {d.condition}
        </p>

        <p className="mx-auto mt-6 max-w-2xl text-xs leading-relaxed text-cream-50/60">
          {d.note}
        </p>
        <p className="mt-6 font-display text-xl italic text-gold-light">
          {d.message}
        </p>
      </div>
    </section>
  );
}
