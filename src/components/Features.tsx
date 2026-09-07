import {
  Car,
  Flame,
  FlameKindling,
  Mountain,
  Trees,
  Waves,
  Wifi,
} from "lucide-react";

const features = [
  {
    icon: Waves,
    title: "Privatni bazen na livadi",
    description:
      "Bazen sa ležaljkama u vlastitom dvorištu, zaklonjen zelenilom i namijenjen isključivo gostima kuće.",
  },
  {
    icon: Trees,
    title: "Veliko dvorište i livada",
    description:
      "Prostrano ograđeno imanje idealno za odmor, igru i boravak u prirodi.",
  },
  {
    icon: Flame,
    title: "Vanjski roštilj i terasa",
    description:
      "Terasa sa velikim stolom uz bazen, roštilj i vanjska rasvjeta za večeri na otvorenom.",
  },
  {
    icon: Mountain,
    title: "Pogled na šumu i planinu",
    description: "Jutarnja kafa uz pogled na borovu šumu i vrhove Igmana.",
  },
  {
    icon: Wifi,
    title: "Wi-Fi i privatni parking",
    description:
      "Besplatan brzi internet u cijeloj kući i osigurano parking mjesto u dvorištu.",
  },
  {
    icon: FlameKindling,
    title: "Grijanje i kamin",
    description:
      "Ugodan planinski enterijer sa drvenim detaljima, topao i u zimskim mjesecima.",
  },
];

export function Features() {
  return (
    <section id="sadrzaji" className="scroll-mt-20 bg-forest-700 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
            Sadržaji
          </p>
          <h2 className="mt-3 font-display text-3xl font-light leading-tight tracking-tight text-mist-50 sm:text-4xl">
            Ono zbog čega se gosti vraćaju.
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded bg-white/[0.07] p-6 transition-colors hover:bg-white/[0.12]"
            >
              <Icon className="h-6 w-6 text-amber-200" aria-hidden />
              <h3 className="mt-4 font-display text-xl text-mist-50">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-mist-50/70">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
