import { Bath, BedDouble, LandPlot, Users } from "lucide-react";

import { AvailabilityCalendar } from "@/components/AvailabilityCalendar";
import { SectionHeading } from "@/components/SectionHeading";
import { site } from "@/lib/content";

export function Overnight({ bookedDates }: { bookedDates: string[] }) {
  const o = site.overnight;
  const stats = [
    { icon: Users, label: "Gostiju", value: `do ${o.capacity.guests}` },
    { icon: BedDouble, label: "Spavaće sobe", value: String(o.capacity.bedrooms) },
    { icon: Bath, label: "Kupatila", value: String(o.capacity.bathrooms) },
    { icon: LandPlot, label: "Površina imanja", value: o.capacity.estateSize },
  ];

  return (
    <section id="nocenje" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Noćenje"
          title="Ostanite duže — cijeli apartman je vaš."
          description={o.description}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded border border-pine-950/10 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="font-display text-xl font-semibold text-pine-700">
              Cijene po noći
            </h3>
            <ul className="mt-4 divide-y divide-pine-950/10">
              {o.pricing.map((row) => (
                <li key={row.label} className="flex items-center justify-between py-3">
                  <span className="text-pine-950/75">{row.label}</span>
                  <span className="font-bold text-pine-700">{row.price}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded bg-cream-100 p-3 text-sm text-pine-950/70">
              Prijava (check-in) {o.houseRules.checkIn}, odjava (check-out){" "}
              {o.houseRules.checkOut}. {o.houseRules.notes.join(" · ")}
            </p>
          </div>

          <dl className="grid grid-cols-2 content-start gap-4">
            {stats.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="rounded border border-pine-950/10 bg-white p-6 text-center shadow-sm"
              >
                <Icon className="mx-auto h-7 w-7 text-pine-500" aria-hidden />
                <dd className="mt-3 font-display text-2xl font-semibold text-pine-700">
                  {value}
                </dd>
                <dt className="mt-1 text-sm text-pine-950/60">{label}</dt>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-14">
          <h3 className="mb-6 text-center font-display text-2xl font-semibold text-pine-700">
            Kalendar zauzetosti — noćenje
          </h3>
          <AvailabilityCalendar bookedDates={bookedDates} />
        </div>
      </div>
    </section>
  );
}
