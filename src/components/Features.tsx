import {
  Car,
  Droplets,
  Fence,
  Flame,
  Goal,
  ThermometerSun,
  Umbrella,
  Volleyball,
  Waves,
  Wifi,
} from "lucide-react";

import { site } from "@/lib/content";

const icons = [
  Waves,           // Privatni bazen
  Umbrella,        // Ležaljke i suncobrani
  Droplets,        // Šadrvan
  Flame,           // Vanjski roštilj
  Goal,            // Mali nogomet
  Volleyball,      // Odbojka
  Car,             // Parking
  Wifi,            // Wi-Fi
  Fence,           // Potpuno ograđeno dvorište
  ThermometerSun,  // Grijanje u bazenu
];

export function Features() {
  return (
    <section id="sadrzaji" className="scroll-mt-20 bg-pine-700 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
            Sadržaji
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-cream-50 sm:text-4xl">
            Sve što treba za savršen dan.
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {site.amenities.map((label, i) => {
            const Icon = icons[i];
            return (
              <div
                key={label}
                className="flex flex-col items-center gap-3 rounded bg-white/[0.07] p-5 text-center transition-colors hover:bg-white/[0.12]"
              >
                <Icon className="h-7 w-7 text-gold-light" aria-hidden />
                <span className="text-sm font-medium leading-snug text-cream-50/90">
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
