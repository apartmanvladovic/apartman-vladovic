import { Check } from "lucide-react";

import { site } from "@/lib/content";

export function PremiumIncludes() {
  return (
    <section className="border-y border-gold/30 bg-cream-100 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-dark">
            Premium paket uključuje
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-pine-700 sm:text-4xl">
            Sve pripremljeno prije nego što stignete.
          </h2>
        </div>

        <ul className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
          {site.premiumIncludes.map((item) => {
            const [lead, rest] = item.split(" — ");
            return (
              <li key={item} className="flex items-start gap-3 rounded bg-white p-4 shadow-sm">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold-dark" aria-hidden />
                <span className="text-sm leading-relaxed text-pine-950/85">
                  <strong className="font-semibold text-pine-800">{lead}</strong>
                  {rest ? ` — ${rest}` : ""}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
