import { ExternalLink, MapPin } from "lucide-react";

import { SectionHeading } from "@/components/SectionHeading";
import { site } from "@/config/site";

export function Location() {
  return (
    <section id="lokacija" className="scroll-mt-20 bg-mist-100 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Lokacija"
          title={site.location.title}
          description={site.location.description}
        />

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="overflow-hidden rounded border border-forest-100 shadow-sm">
            <iframe
              title={`Mapa — ${site.name}`}
              src={site.location.mapEmbedUrl}
              className="h-full min-h-[320px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          <div>
            <ul className="space-y-3">
              {site.location.distances.map((d) => (
                <li
                  key={d.label}
                  className="flex items-center gap-4 rounded border border-forest-100 bg-white p-4 shadow-sm"
                >
                  <MapPin className="h-5 w-5 shrink-0 text-forest-500" aria-hidden />
                  <span className="flex-1 text-forest-950/80">{d.label}</span>
                  <span className="font-semibold text-forest-800">{d.value}</span>
                </li>
              ))}
            </ul>

            <a
              href={site.location.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-forest-300 px-5 py-2.5 text-sm font-semibold text-forest-700 transition-colors hover:bg-forest-50"
            >
              <ExternalLink className="h-4 w-4" aria-hidden />
              Otvori u Google mapama
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
