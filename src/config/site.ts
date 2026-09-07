/**
 * Centralna konfiguracija — Vikendica AQUA.
 * Svi tekstovi, cijene, paketi i pravila mijenjaju se ISKLJUČIVO ovdje.
 */

export const site = {
  name: "Vikendica AQUA",
  slogan: "Vaš privatni kutak mira, samo za vas.",
  tagline: "20 minuta od Sarajeva",
  hours: "09:00 – 20:00 h",
  cta: "Rezerviši svoj dan na vrijeme!",

  contact: {
    phoneDisplay: "061 878 595",
    phoneIntl: "38761878595",
  },

  hero: {
    title: "VIKENDICA AQUA – Vaš privatni kutak mira",
    subtitle: "20 min od Sarajeva | Dnevni najam 09:00 – 20:00 h ili noćenje",
    highlights: [
      "CIJELI DAN UŽIVANJA U PRIVATNOSTI!",
      "BEZ KORIŠTENJA UNUTRAŠNJOSTI KUĆE",
    ],

    intro:
      "Uživajte u bazenu, prirodi, druženju i svim sadržajima koje smo pripremili. Mi ćemo se pobrinuti za detalje, a vaše je samo da dođete i uživate.",
    heatingBadge: {
      title: "Grijanje u bazenu",
      text: "Toplota tokom cijelog sezonskog perioda za maksimalno uživanje!",
    },
    advantages: [
      "Potpuno ograđeno",
      "Idealno za porodice i društva",
      "Mir, priroda i potpuna privatnost",
    ],
  },

  overnight: {
    title: "Noćenje — Apartman",
    description:
      "Za sve koji žele ostati duže: kompletno opremljen apartman sa kuhinjom, spavaćim sobama i kupatilom, uz sve vanjske sadržaje.",
    capacity: { guests: 6, bedrooms: 2, bathrooms: 1, estateSize: "1.500 m²" },
    pricing: [
      { label: "Ljetna sezona (jun – septembar)", price: "140 € / noć" },
      { label: "Zimska sezona (decembar – mart)", price: "120 € / noć" },
      { label: "Preostali period", price: "110 € / noć" },
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
  },

  location: {
    title: "Podnožje planine Igman",
    description:
      "Objekat se nalazi u mirnom planinskom okruženju podno Igmana, okružen borovom šumom i livadama. Idealna polazna tačka za izlete na Igman, Veliku aleju i Vrelo Bosne, a ipak dovoljno bli[...]",
    distances: [
      { label: "Centar Sarajeva", value: "cca 30 min vožnje" },
      { label: "Vrelo Bosne i Velika aleja", value: "cca 20 min vožnje" },
      { label: "Planinske staze Igmana", value: "5 – 15 min" },
      { label: "Aerodrom Sarajevo", value: "cca 25 min vožnje" },
    ],
    // Tačna lokacija objekta (43.8035377, 18.2040934).
    mapEmbedUrl:
      "https://www.google.com/maps?q=43.80353772946597,18.204093377165158&z=15&output=embed",
    mapsLink: "https://www.google.com/maps?q=43.80353772946597,18.204093377165158",
  },

  amenities: [
    "Privatni bazen",
    "Ležaljke i suncobrani",
    "Šadrvan",
    "Vanjski roštilj",
    "Mali nogomet",
    "Odbojka",
    "Parking",
    "Wi-Fi",
    "Potpuno ograđeno dvorište",
    "Grijanje u bazenu",
  ],

  packages: [
    {
      id: "paket-1",
      name: "Paket 1",
      capacity: 5,
      theme: "pine" as const,
      weekdayPrice: "250 KM",
      weekendPrice: "350 KM",
      deposit: "100 KM",
      note: "Završno čišćenje snosi osoba koja je rentala objekat.",
    },
    {
      id: "paket-2",
      name: "Paket 2",
      capacity: 10,
      theme: "navy" as const,
      weekdayPrice: "350 KM",
      weekendPrice: "400 KM",
      deposit: "200 KM",
      note: "Završno čišćenje snosi osoba koja je rentala objekat.",
    },
    {
      id: "premium",
      name: "Premium paket",
      capacity: 10,
      theme: "gold" as const,
      badge: "Najpopularnije",
      weekdayPrice: "450 KM",
      weekendPrice: "550 KM",
      deposit: "200 KM",
      note: "Završno čišćenje uključeno u Premium paket.",
    },
  ],

  premiumIncludes: [
    "Piće po narudžbi spremno prije dolaska — po vašoj narudžbi: sokovi, voda, pivo, vino i ostalo",
    "Ohlađeno piće i led — sve već rashlađeno, kad stignete",
    "Čaše, tanjiri, pribor i salvete — sve što vam treba za ugodan boravak",
    "Roštilj pripremljen za korištenje — čist, spreman i provjeren",
    "Ćumur i potpaljivač — pripremljeno za korištenje roštilja",
    "Šadrvan pripremljen — čist i spreman za vaše društvo",
    "Ležaljke i suncobrani pripremljeni — sve podešeno, spremno za uživanje",
    "Završno čišćenje uključeno — vi uživajte, mi se pobrinemo za čistoću",
    "Mogućnost nabavke ostalih stvari — po vašoj narudžbi, sve što vam zatreba",
  ],

  drinksService: {
    title: "Želite da vas sve čeka spremno?",
    text: "Nema potrebe da prije dolaska obilazite prodavnice. Po vašoj narudžbi možemo pripremiti pića i ostale potrebne stvari za vaš boravak.",
    available: ["Sokovi", "Voda", "Pivo", "Vino", "Ostalo po dogovoru"],
    condition: "Najava najmanje 12 sati ranije.",
    note: "Meso, alkohol i ostale namirnice nisu uključene u cijenu. Nabavka se vrši isključivo po prethodnoj narudžbi i gost je plaća posebno.",
    message: "Vi samo dođite – mi ćemo se pobrinuti za ostalo.",
  },

  rules: [
    {
      title: "Vrijeme dnevnog boravka",
      items: [
        "Dnevni boravak traje od 09:00 do 20:00 sati.",
        "Nakon 20:00 sati gosti su dužni napustiti objekat, osim ako je drugačije prethodno dogovoreno.",
      ],
    },
    {
      title: "Broj gostiju",
      items: [
        "Paket 1: maksimalno 5 osoba.",
        "Paket 2: maksimalno 10 osoba.",
        "Dovođenje dodatnih osoba bez prethodnog dogovora sa vlasnikom nije dozvoljeno.",
      ],
    },
    {
      title: "Korištenje bazena",
      items: [
        "Bazen je privatan i namijenjen isključivo prijavljenim gostima.",
        "Korištenje bazena je na vlastitu odgovornost.",
        "Djeca moraju biti pod stalnim nadzorom roditelja ili odgovorne odrasle osobe.",
        "Zabranjeno je trčanje, guranje i neodgovorno ponašanje oko bazena.",
        "Staklene flaše, čaše i drugi lomljivi predmeti strogo su zabranjeni u prostoru bazena.",
        "Zabranjeno je skakanje u bazen na način kojim se ugrožavaju druge osobe ili može nastati šteta.",
      ],
    },
    {
      title: "Obavezno tuširanje prije i poslije bazena",
      highlight: "TUŠIRANJE PRIJE ULASKA U BAZEN JE OBAVEZNO.",
      items: [
        "Prije svakog ulaska u bazen potrebno je temeljno isprati tijelo.",
        "Posebno je važno ukloniti znoj, prašinu, ulja, losione i ostatke kozmetičkih proizvoda.",
        "Nakon korištenja krema za sunčanje potrebno je ponovo se istuširati prije ulaska u bazen.",
        "Nije dozvoljen ulazak u bazen neposredno nakon nanošenja kreme, ulja ili losiona.",
        "Nakon korištenja bazena molimo goste da se ponovo istuširaju.",
      ],
      footer: "Čist bazen = ugodniji boravak za sve.",
    },
    {
      title: "Korištenje vanjskog prostora",
      items: [
        "Gostima su na raspolaganju: bazen, ležaljke i suncobrani, šadrvan, vanjski roštilj, mali nogomet, odbojka, parking, Wi-Fi, potpuno ograđeno dvorište.",
      ],
      footer: "Sva oprema koristi se pažljivo i odgovorno.",
    },
    {
      title: "Unutrašnjost kuće",
      items: [
        "Dnevni najam ne uključuje korištenje unutrašnjosti kuće.",
        "Nije dozvoljeno korištenje: spavaćih soba, kuhinje, dnevnog boravka, unutrašnjeg kupatila, ostalih prostorija u kući.",
      ],
    },
    {
      title: "Roštilj",
      items: [
        "Roštilj se koristi isključivo na predviđenom mjestu.",
        "Gosti su dužni voditi računa o sigurnosti i mogućnosti požara.",
        "Nakon korištenja potrebno je ugasiti vatru i ostaviti prostor urednim.",
        "Nije dozvoljeno premještanje roštilja.",
      ],
    },
    {
      title: "Muzika i buka",
      items: [
        "Muzika je dozvoljena uz poštovanje komšija i okoline.",
        "Nije dozvoljena pretjerana buka niti ponašanje kojim se narušava mir u okolini.",
        "Posebno molimo goste da u kasnijim satima smanje nivo buke.",
      ],
    },
    {
      title: "Čistoća i održavanje",
      items: [
        "Otpad je potrebno odlagati na predviđeno mjesto.",
        "Nije dozvoljeno bacanje otpada u bazen ili po dvorištu.",
        "Molimo goste da prostor i opremu ostave urednim nakon korištenja.",
      ],
    },
    {
      title: "Sigurnosni depozit",
      items: [
        "Za dnevni boravak može se naplatiti sigurnosni depozit prema paketu: Paket 1 – 100 KM, Paket 2 i Premium – 200 KM.",
        "Depozit se vraća nakon pregleda prostora ukoliko nije nastala šteta ili dodatni trošak zbog neodgovornog korištenja objekta.",
      ],
    },
    {
      title: "Odgovornost za štetu",
      items: [
        "Gost odgovara za štetu nastalu namjerno ili nepažnjom, uključujući oštećenje bazena, ležaljki, suncobrana, šadrvana, sportske opreme i druge imovine.",
        "U slučaju nastale štete, trošak popravke ili zamjene može biti naplaćen iz sigurnosnog depozita, odnosno dodatno ukoliko šteta prelazi iznos depozita.",
      ],
    },
    {
      title: "Parking",
      items: [
        "Vozila se parkiraju na predviđenom parking prostoru.",
        "Vlasnik objekta ne odgovara za stvari ostavljene u vozilu.",
      ],
    },
    {
      title: "Poštivanje prostora i okoline",
      items: [
        "Molimo vas da poštujete: privatnost komšija, prirodu i dvorište, opremu i imovinu, pravila korištenja bazena, ostale goste.",
      ],
    },
  ],

  finale: {
    title: "NAJVAŽNIJE – UŽIVAJTE!",
    text: "Vikendica AQUA je mjesto za odmor, druženje i uživanje. Mi ćemo se pobrinuti za detalje, a vaše je samo da dođete, opustite se i uživate.",
    signature: "Vaš privatni kutak mira – 20 minuta od Sarajeva.",
    closers: ["Vi samo dođite. Uživanje može početi odmah!", "Uživaj. Odmori se. Poveži se."],
  },

  footerRules: [
    "Tuširajte se prije i poslije korištenja bazena",
    "Djeca moraju biti pod nadzorom odraslih",
    "Staklene flaše i lomljivi predmeti su zabranjeni",
    "Održavajte prostor urednim i čistim",
    "Čuvajmo prirodu i okolinu",
  ],
} as const;

export type Site = typeof site;
