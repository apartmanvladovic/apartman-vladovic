import { Ban, Leaf, ShowerHead, Sparkles, Users } from "lucide-react";

import { site } from "@/config/site";

const ruleIcons = [ShowerHead, Users, Ban, Sparkles, Leaf];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-pine-950 text-cream-50/80">
      {/* Traka sa 5 ključnih pravila */}
      <div className="border-b border-white/10">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-12 sm:grid-cols-3 sm:px-6 lg:grid-cols-5">
          {site.footerRules.map((rule, i) => {
            const Icon = ruleIcons[i];
            return (
              <div key={rule} className="flex flex-col items-center gap-3 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
                  <Icon className="h-5 w-5 text-gold-light" aria-hidden />
                </span>
                <p className="text-xs leading-relaxed text-cream-50/70">{rule}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-12 text-center sm:px-6">
        <p className="font-display text-2xl font-semibold text-cream-50">
          {site.name}
        </p>
        <p className="max-w-md text-sm leading-relaxed">{site.slogan}</p>
        <div className="flex flex-col items-center gap-2 text-sm">
          <a
            href={`tel:+${site.contact.phoneIntl}`}
            className="text-lg font-semibold text-gold-light hover:text-gold"
          >
            {site.contact.phoneDisplay}
          </a>
          <p className="text-cream-50/60">{site.tagline} · Dnevni najam {site.hours}</p>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-cream-50/50">
        © {year} {site.name}. Sva prava zadržana.
      </div>
    </footer>
  );
}
