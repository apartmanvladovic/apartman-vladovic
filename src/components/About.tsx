import { Bath, BedDouble, LandPlot, Users } from "lucide-react";

import { SectionHeading } from "@/components/SectionHeading";
import { site } from "@/config/site";

export function About() {
  const stats = [
    { icon: Users, label: "Gostiju", value: `do ${site.capacity.guests}` },
    { icon: BedDouble, label: "Spavaće sobe", value: String(site.capacity.bedrooms) },
    { icon: Bath, label: "Kupatila", value: String(site.capacity.bathrooms) },
    { icon: LandPlot, label: "Površina imanja", value: site.capacity.estateSize },
  ];

  return (
    <section id="o-nama" className="scroll-mt-20 bg-mist-50 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow="O nama" title={site.about.heading} />

        <div className="mx-auto max-w-3xl space-y-5 text-center text-lg leading-relaxed text-forest-950/80">
          {site.about.paragraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>

        <dl className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="rounded-2xl border border-forest-100 bg-white p-6 text-center shadow-sm"
            >
              <Icon className="mx-auto h-7 w-7 text-forest-500" aria-hidden />
              <dd className="mt-3 text-2xl font-bold text-forest-800">{value}</dd>
              <dt className="mt-1 text-sm text-forest-950/60">{label}</dt>
            </div>
          ))}
        </dl>

        <div className="mx-auto mt-14 max-w-4xl rounded-2xl bg-forest-700 p-8 text-white">
          <h3 className="text-lg font-semibold">Cjenovnik</h3>
          <ul className="mt-4 divide-y divide-white/15">
            {site.pricing.map((row) => (
              <li
                key={row.label}
                className="flex items-center justify-between py-3"
              >
                <span className="text-white/85">{row.label}</span>
                <span className="font-semibold">{row.price}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
