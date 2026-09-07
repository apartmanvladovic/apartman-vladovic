/**
 * Centralna konfiguracija objekta — svi tekstovi, kontakti, cijene i
 * sadržaji se mijenjaju ISKLJUČIVO ovdje. Nijedna komponenta ne sadrži
 * hardkodovane podatke o objektu.
 */

export const site = {
  name: "Apartman Vladović",
  tagline: "Vaša privatna oaza mira i bazen u podnožju planine Igman",
  description:
    "Apartman Vladović — miran planinski odmor sa privatnim bazenom, velikim dvorištem i pogledom na šumu, u podnožju planine Igman nadomak Sarajeva.",

  contact: {
    email: "apartmanvladovic@gmail.com",
    // Prikazani broj — zamijeniti pravim.
    phoneDisplay: "+387 61 000 000",
    // Međunarodni format bez + i razmaka — koristi se za tel: i wa.me linkove.
    phoneIntl: "38761000000",
  },

  capacity: {
    guests: 6,
    bedrooms: 2,
    bathrooms: 1,
    estateSize: "1.500 m²",
  },

  // Cijene po sezoni — prikaz u sekciji O nama.
  pricing: [
    { label: "Ljetna sezona (jun – septembar)", price: "120 € / noć" },
    { label: "Zimska sezona (decembar – mart)", price: "100 € / noć" },
    { label: "Preostali period", price: "90 € / noć" },
    { label: "Minimalan boravak", price: "2 noći" },
  ],

  houseRules: {
    checkIn: "od 14:00",
    checkOut: "do 10:00",
    notes: [
      "Kućni ljubimci po dogovoru",
      "Zabave i događaji nisu dozvoljeni",
      "Bazen se koristi na vlastitu odgovornost",
    ],
  },

  location: {
    title: "Podnožje planine Igman",
    description:
      "Apartman se nalazi u mirnom planinskom okruženju podno Igmana, okružen borovom šumom i livadama. Idealna polazna tačka za izlete na Igman, Veliku aleju i Vrelo Bosne, a ipak dovoljno blizu Sarajeva za dnevne posjete gradu.",
    distances: [
      { label: "Centar Sarajeva", value: "cca 30 min vožnje" },
      { label: "Vrelo Bosne i Velika aleja", value: "cca 20 min vožnje" },
      { label: "Planinske staze Igmana", value: "5 – 15 min" },
      { label: "Aerodrom Sarajevo", value: "cca 25 min vožnje" },
    ],
    // Google Maps embed (bez API ključa) — zamijeniti tačnom lokacijom.
    mapEmbedUrl:
      "https://www.google.com/maps?q=Igman%20Bosna%20i%20Hercegovina&z=12&output=embed",
    mapsLink: "https://www.google.com/maps?q=Igman+Bosna+i+Hercegovina",
  },

  about: {
    heading: "Odmor u netaknutoj prirodi",
    paragraphs: [
      "Apartman Vladović smješten je u podnožju planine Igman, okružen livadama i borovom šumom. Ovdje dan počinje cvrkutom ptica i mirisom čempresa, a završava se tišinom koju grad nikada ne poznaje.",
      "Privatni bazen na otvorenom, veliko dvorište za igru i odmor, terasa sa pogledom na planinu i ugodan enterijer sa drvenim detaljima čine ovaj dom idealnim za porodice i parove koji traže privatnost, svjež zrak i pravi planinski mir — tokom cijele godine.",
    ],
  },
} as const;

export type Site = typeof site;
