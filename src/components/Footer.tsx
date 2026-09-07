import { Mountain } from "lucide-react";

import { site } from "@/config/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-forest-900 py-14 text-white/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-3">
        <div>
          <p className="flex items-center gap-2 text-lg font-semibold text-white">
            <Mountain className="h-5 w-5" aria-hidden />
            {site.name}
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed">
            {site.tagline}.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Pravila kuće
          </h3>
          <ul className="mt-3 space-y-1.5 text-sm">
            <li>Prijava (check-in) {site.houseRules.checkIn}</li>
            <li>Odjava (check-out) {site.houseRules.checkOut}</li>
            {site.houseRules.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Kontakt
          </h3>
          <ul className="mt-3 space-y-1.5 text-sm">
            <li>
              <a href={`mailto:${site.contact.email}`} className="hover:text-white">
                {site.contact.email}
              </a>
            </li>
            <li>
              <a href={`tel:+${site.contact.phoneIntl}`} className="hover:text-white">
                {site.contact.phoneDisplay}
              </a>
            </li>
            <li>{site.location.title}</li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl border-t border-white/10 px-4 pt-6 text-center text-xs text-white/50 sm:px-6">
        © {year} {site.name}. Sva prava zadržana.
      </div>
    </footer>
  );
}
