import { Clock, Crown, ShieldCheck, Users } from "lucide-react";

import { site } from "@/config/site";

const themes = {
  pine: {
    card: "border-pine-200 bg-white",
    header: "bg-pine-700 text-cream-50",
    price: "text-pine-700",
  },
  navy: {
    card: "border-navy-200 bg-white",
    header: "bg-navy-700 text-cream-50",
    price: "text-navy-700",
  },
  gold: {
    card: "border-gold bg-pine-950 text-cream-50 ring-2 ring-gold",
    header: "bg-gold text-pine-950",
    price: "text-gold-light",
  },
} as const;

export function Packages() {
  return (
    <section id="paketi" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-dark">
            Paketi i cijene
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-pine-700 sm:text-4xl">
            Odaberite paket za vaš dan.
          </h2>
          <p className="mt-4 text-pine-950/70">
            Svi paketi pokrivaju dnevni najam od 09:00 do 20:00 h.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {site.packages.map((pkg) => {
            const t = themes[pkg.theme];
            const isPremium = pkg.theme === "gold";
            return (
              <div
                key={pkg.id}
                className={`relative flex flex-col overflow-hidden rounded border ${t.card} ${isPremium ? "lg:-mt-4 lg:mb-[-1rem]" : ""}`}
              >
                {"badge" in pkg && pkg.badge && (
                  <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-pine-950/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gold-light">
                    <Crown className="h-3.5 w-3.5" aria-hidden />
                    {pkg.badge}
                  </div>
                )}

                <div className={`px-6 py-5 ${t.header}`}>
                  <h3 className="font-display text-2xl font-semibold">{pkg.name}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-sm opacity-85">
                    <Users className="h-4 w-4" aria-hidden />
                    do {pkg.capacity} osoba
                  </p>
                </div>

                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm opacity-70">Ponedjeljak – četvrtak</span>
                    <span className={`text-2xl font-bold ${t.price}`}>{pkg.weekdayPrice}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-current/10 pt-4">
                    <span className="text-sm opacity-70">Petak – nedjelja</span>
                    <span className={`text-2xl font-bold ${t.price}`}>{pkg.weekendPrice}</span>
                  </div>

                  <div className="mt-2 space-y-2 text-sm">
                    <p className="flex items-center gap-2 opacity-80">
                      <Clock className="h-4 w-4 shrink-0" aria-hidden />
                      {site.hours}
                    </p>
                    <p className="flex items-center gap-2 opacity-80">
                      <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden />
                      Sigurnosni depozit: {pkg.deposit}
                    </p>
                  </div>

                  <p className="mt-auto rounded bg-current/5 p-3 text-xs leading-relaxed opacity-70">
                    {pkg.note}
                  </p>

                  <a
                    href="#kontakt"
                    className={`mt-2 rounded-full px-5 py-3 text-center text-sm font-bold uppercase tracking-wide transition-colors ${
                      isPremium
                        ? "bg-gold text-pine-950 hover:bg-gold-light"
                        : "bg-pine-700 text-cream-50 hover:bg-pine-600"
                    }`}
                  >
                    Rezerviši
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
