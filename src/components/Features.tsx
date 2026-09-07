import {
  Car,
  Flame,
  FlameKindling,
  Mountain,
  Trees,
  Waves,
  Wifi,
} from "lucide-react";

import { SectionHeading } from "@/components/SectionHeading";

const features = [
  {
    icon: Waves,
    title: "Privatni bazen na otvorenom",
    description: "Bazen samo za vas, okružen travnjakom i pogledom na zelenilo.",
  },
  {
    icon: Trees,
    title: "Veliko dvorište i livada",
    description: "Prostrano imanje idealno za odmor, igru i boravak u prirodi.",
  },
  {
    icon: Flame,
    title: "Vanjski roštilj",
    description: "Natkriven prostor za roštilj i druženje na otvorenom.",
  },
  {
    icon: Mountain,
    title: "Terasa sa pogledom",
    description: "Jutarnja kafa uz pogled na šumu i vrhove Igmana.",
  },
  {
    icon: Wifi,
    title: "Wi-Fi i privatni parking",
    description: "Besplatan brzi internet i osigurano parking mjesto u dvorištu.",
  },
  {
    icon: FlameKindling,
    title: "Grijanje i kamin",
    description: "Ugodan planinski enterijer topl i u zimskim mjesecima.",
  },
];

export function Features() {
  return (
    <section id="sadrzaji" className="scroll-mt-20 bg-mist-100 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Sadržaji"
          title="Sve što treba za bezbrižan odmor"
          description="Pažljivo odabrane pogodnosti za porodice i parove koji traže privatnost i kontakt sa prirodom."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-forest-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-50">
                <Icon className="h-6 w-6 text-forest-500" aria-hidden />
              </div>
              <h3 className="mt-4 font-semibold text-forest-800">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-forest-950/70">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
