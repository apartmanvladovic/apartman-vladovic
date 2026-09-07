import { Bath, BedDouble, LandPlot, Users } from "lucide-react";
import Image from "next/image";

import { SectionHeading } from "@/components/SectionHeading";
import { site } from "@/config/site";
import { aboutImage } from "@/lib/images";

const chips = ["Cijela kuća", "Privatni bazen", "Ograđeno dvorište", "Cjelogodišnji boravak"];

export function About() {
  const stats = [
    { icon: Users, label: "Gostiju", value: `do ${site.capacity.guests}` },
    { icon: BedDouble, label: "Spavaće sobe", value: String(site.capacity.bedrooms) },
    { icon: Bath, label: "Kupatila", value: String(site.capacity.bathrooms) },
    { icon: LandPlot, label: "Površina imanja", value: site.capacity.estateSize },
  ];

  return (
    <section id="o-nama" className="scroll-mt-20 border-t border-brand-950/10 bg-mist-50 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              align="left"
              eyebrow="O nama"
              title="Kuća, dvorište i bazen — sve samo za vas."
            />
            <div className="-mt-4 space-y-5 leading-relaxed text-brand-950/75">
              {site.about.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap gap-2">
              {chips.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-mist-100 px-4 py-2 text-xs font-medium text-brand-700"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="relative aspect-square overflow-hidden rounded shadow-lg">
            <Image
              src={aboutImage.src}
              alt={aboutImage.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="rounded border border-brand-950/10 bg-white p-6 text-center"
            >
              <Icon className="mx-auto h-7 w-7 text-brand-500" aria-hidden />
              <dd className="mt-3 text-2xl font-light text-brand-700">{value}</dd>
              <dt className="mt-1 text-sm text-brand-950/60">{label}</dt>
            </div>
          ))}
        </dl>

        <div className="mt-12 rounded bg-brand-700 p-8 text-white">
          <h3 className="text-xl font-light">Cjenovnik</h3>
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
