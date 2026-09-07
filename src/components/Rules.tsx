import { site } from "@/config/site";

export function Rules() {
  return (
    <section id="pravila" className="scroll-mt-20 bg-cream-100 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-dark">
            Kućni red
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-pine-700 sm:text-4xl">
            Pravila dnevnog boravka gostiju.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {site.rules.map((rule, i) => (
            <div
              key={rule.title}
              className="rounded border border-pine-950/10 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pine-700 font-display text-xs font-semibold text-gold-light">
                  {i + 1}
                </span>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-pine-800">
                  {rule.title}
                </h3>
              </div>
              {"highlight" in rule && rule.highlight && (
                <p className="mt-3 rounded border border-gold/40 bg-gold/10 px-3 py-2 text-xs font-bold uppercase tracking-wide text-gold-dark">
                  {rule.highlight}
                </p>
              )}
              <ul className="mt-3 list-disc space-y-1 pl-8 text-[13px] leading-relaxed text-pine-950/75">
                {rule.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {"footer" in rule && rule.footer && (
                <p className="mt-3 text-xs font-semibold italic text-pine-600">
                  {rule.footer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
