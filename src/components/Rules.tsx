import { ChevronDown } from "lucide-react";

import { site } from "@/config/site";

export function Rules() {
  return (
    <section id="pravila" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-dark">
            Kućni red
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-pine-700 sm:text-4xl">
            Pravila dnevnog boravka gostiju.
          </h2>
        </div>

        <div className="space-y-3">
          {site.rules.map((rule, i) => (
            <details
              key={rule.title}
              className="group rounded border border-pine-950/10 bg-white shadow-sm"
            >
              <summary className="flex cursor-pointer list-none items-center gap-4 p-5 [&::-webkit-details-marker]:hidden">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pine-700 font-display text-sm font-semibold text-gold-light">
                  {i + 1}
                </span>
                <span className="flex-1 font-semibold uppercase tracking-wide text-pine-800">
                  {rule.title}
                </span>
                <ChevronDown
                  className="h-5 w-5 shrink-0 text-pine-950/40 transition-transform group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <div className="border-t border-pine-950/10 px-5 py-4 pl-[4.5rem]">
                {"highlight" in rule && rule.highlight && (
                  <p className="mb-3 rounded border border-gold/40 bg-gold/10 px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-gold-dark">
                    {rule.highlight}
                  </p>
                )}
                <ul className="list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-pine-950/75">
                  {rule.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {"footer" in rule && rule.footer && (
                  <p className="mt-3 text-sm font-semibold italic text-pine-600">
                    {rule.footer}
                  </p>
                )}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
