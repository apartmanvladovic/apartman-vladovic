/**
 * Gemini 2.5 Flash — uređivanje content/site-data.json kroz admin chat.
 * Structured output: { reply, data } gdje je data kompletan ažurirani
 * site-data JSON (shema odgovara SiteData tipu).
 */
import { GoogleGenAI, Type, type Schema } from "@google/genai";

import type { SiteData } from "@/lib/content";

const MODEL = "gemini-2.5-flash";

const siteDataSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    slogan: { type: Type.STRING },
    tagline: { type: Type.STRING },
    hours: { type: Type.STRING },
    cta: { type: Type.STRING },
    contact: {
      type: Type.OBJECT,
      properties: {
        phoneDisplay: { type: Type.STRING },
        phoneIntl: { type: Type.STRING },
      },
      required: ["phoneDisplay", "phoneIntl"],
    },
    hero: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        subtitle: { type: Type.STRING },
        highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
        intro: { type: Type.STRING },
        heatingBadge: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            text: { type: Type.STRING },
          },
          required: ["title", "text"],
        },
        advantages: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["title", "subtitle", "highlights", "intro", "heatingBadge", "advantages"],
    },
    overnight: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        capacity: {
          type: Type.OBJECT,
          properties: {
            guests: { type: Type.INTEGER },
            bedrooms: { type: Type.INTEGER },
            bathrooms: { type: Type.INTEGER },
            estateSize: { type: Type.STRING },
          },
          required: ["guests", "bedrooms", "bathrooms", "estateSize"],
        },
        pricing: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              price: { type: Type.STRING },
            },
            required: ["label", "price"],
          },
        },
        houseRules: {
          type: Type.OBJECT,
          properties: {
            checkIn: { type: Type.STRING },
            checkOut: { type: Type.STRING },
            notes: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["checkIn", "checkOut", "notes"],
        },
      },
      required: ["title", "description", "capacity", "pricing", "houseRules"],
    },
    location: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        distances: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              value: { type: Type.STRING },
            },
            required: ["label", "value"],
          },
        },
        mapEmbedUrl: { type: Type.STRING },
        mapsLink: { type: Type.STRING },
      },
      required: ["title", "description", "distances", "mapEmbedUrl", "mapsLink"],
    },
    amenities: { type: Type.ARRAY, items: { type: Type.STRING } },
    packages: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          capacity: { type: Type.INTEGER },
          theme: { type: Type.STRING, enum: ["pine", "navy", "gold"] },
          badge: { type: Type.STRING, nullable: true },
          weekdayPrice: { type: Type.STRING },
          weekendPrice: { type: Type.STRING },
          deposit: { type: Type.STRING },
          note: { type: Type.STRING },
        },
        required: ["id", "name", "capacity", "theme", "weekdayPrice", "weekendPrice", "deposit", "note"],
      },
    },
    premiumIncludes: { type: Type.ARRAY, items: { type: Type.STRING } },
    drinksService: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        text: { type: Type.STRING },
        available: { type: Type.ARRAY, items: { type: Type.STRING } },
        condition: { type: Type.STRING },
        note: { type: Type.STRING },
        message: { type: Type.STRING },
      },
      required: ["title", "text", "available", "condition", "note", "message"],
    },
    rules: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          highlight: { type: Type.STRING, nullable: true },
          items: { type: Type.ARRAY, items: { type: Type.STRING } },
          footer: { type: Type.STRING, nullable: true },
        },
        required: ["title", "items"],
      },
    },
    finale: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        text: { type: Type.STRING },
        signature: { type: Type.STRING },
        closers: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["title", "text", "signature", "closers"],
    },
    footerRules: { type: Type.ARRAY, items: { type: Type.STRING } },
    images: {
      type: Type.OBJECT,
      properties: {
        hero: {
          type: Type.OBJECT,
          properties: {
            src: { type: Type.STRING },
            alt: { type: Type.STRING },
          },
          required: ["src", "alt"],
        },
        finale: {
          type: Type.OBJECT,
          properties: {
            src: { type: Type.STRING },
            alt: { type: Type.STRING },
          },
          required: ["src", "alt"],
        },
        gallery: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              src: { type: Type.STRING },
              alt: { type: Type.STRING },
              category: { type: Type.STRING },
            },
            required: ["src", "alt", "category"],
          },
        },
      },
      required: ["hero", "finale", "gallery"],
    },
  },
  required: [
    "name", "slogan", "tagline", "hours", "cta", "contact", "hero",
    "overnight", "location", "amenities", "packages", "premiumIncludes",
    "drinksService", "rules", "finale", "footerRules", "images",
  ],
};

const bookedDatesSchema: Schema = {
  type: Type.OBJECT,
  description: "Kompletan sadržaj data/bookedDates.json — zauzetost kalendara.",
  properties: {
    bookedDates: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Pojedinačni zauzeti datumi, format YYYY-MM-DD.",
    },
    bookedRanges: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          start: { type: Type.STRING, description: "Check-in YYYY-MM-DD (zauzet)." },
          end: { type: Type.STRING, description: "Check-out YYYY-MM-DD (SLOBODAN dan)." },
          note: { type: Type.STRING, nullable: true },
        },
        required: ["start", "end"],
      },
    },
  },
  required: ["bookedDates", "bookedRanges"],
};

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    reply: {
      type: Type.STRING,
      description: "Kratka poruka administratoru na bosanskom — šta je urađeno.",
    },
    siteData: {
      ...siteDataSchema,
      description:
        "KOMPLETAN ažurirani site-data.json — pošalji SAMO ako administrator traži izmjenu sadržaja; inače izostavi.",
    },
    bookedDates: {
      ...bookedDatesSchema,
    },
    codeRequest: {
      type: Type.OBJECT,
      description:
        "Popuni SAMO ako izmjena zahtijeva izvorni kod (ne može kroz siteData/bookedDates) — navedi koje fajlove trebaš vidjeti. Sadržaj fajlova dobivaš u sljedećem koraku.",
      properties: {
        files: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Putanje postojećih fajlova iz date liste koje trebaš pročitati.",
        },
        plan: { type: Type.STRING, description: "Jedna rečenica: šta ćeš uraditi u kodu." },
      },
      required: ["files", "plan"],
      nullable: true,
    },
  },
  required: ["reply"],
};

const codeEditResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    reply: {
      type: Type.STRING,
      description: "Kratka poruka administratoru na bosanskom — šta je urađeno u kodu.",
    },
    codeEdits: {
      type: Type.ARRAY,
      description: "Za svaki fajl KOMPLETAN novi sadržaj (ne diff).",
      items: {
        type: Type.OBJECT,
        properties: {
          path: { type: Type.STRING, description: "Putanja fajla, npr. src/components/Hero.tsx" },
          content: { type: Type.STRING, description: "Kompletan novi sadržaj fajla." },
          summary: { type: Type.STRING, description: "Jedna rečenica: šta je promijenjeno." },
        },
        required: ["path", "content", "summary"],
      },
    },
  },
  required: ["reply", "codeEdits"],
};

const SYSTEM_INSTRUCTION = `Ti si asistent koji uređuje web stranicu Vikendica AQUA (vikendica sa bazenom kod Sarajeva), Next.js + Tailwind projekat.
Administrator (vlasnik, ne tehnička osoba) ti šalje zahtjev na bosanskom. Odgovaraš structured JSON-om sa poljima:

- reply (obavezno): kratka potvrda na bosanskom šta si uradio (1-2 rečenice).
- siteData (opcionalno): KOMPLETAN ažurirani site-data.json — pošalji samo ako mijenjaš tekstove, cijene, slike, kontakt ili bilo koji sadržaj koji već postoji u tom fajlu. Uvijek vrati CIJELI JSON sa svim poljima; mijenjaj samo traženo.
- bookedDates (opcionalno): KOMPLETAN novi sadržaj kalendara zauzetosti — pošalji samo za izmjene dostupnosti (npr. "označi 15–20. septembar kao zauzeto", "oslobodi 5. oktobar"). Formati: YYYY-MM-DD; range "end" je dan odjave i ostaje SLOBODAN (Airbnb konvencija).
- codeRequest (opcionalno): koristi SAMO kada izmjenu NIJE moguće uraditi kroz siteData/bookedDates (npr. nova sekcija, drugačiji raspored, nova komponenta). Navedi koje postojeće fajlove trebaš pročitati (iz priložene liste) i kratki plan — sadržaj fajlova dobivaš u sljedećem koraku, gdje ćeš vratiti konačne izmjene. Ako trebaš napraviti potpuno novi fajl, navedi najbliže postojeće fajlove kao referencu stila.

Pravila:
- Ako je poruka samo pitanje bez zahtjeva za izmjenom, odgovori u reply polju i izostavi sva ostala polja.
- Tekst piši na bosanskom, u istom tonu i stilu kao postojeći sadržaj.
- Putanje slika su relativne (npr. /images/hero.jpg ili /uploads/...). Nikad ne izmišljaj putanje — koristi samo postojeće ili onu koja ti je eksplicitno data uz priloženu sliku.
- Ako je uz poruku priložena slika, pogledaj je i iskoristi njen dati public path tamo gdje administrator traži (npr. images.hero.src ili nova stavka u images.gallery sa smislenim alt tekstom i kategorijom).
- Cijene i novčane iznose mijenjaj samo ako je to eksplicitno traženo.
- Nemoj mijenjati src/auth.ts, src/middleware.ts niti admin chat rute (src/app/api/admin/, src/app/admin/) osim ako administrator izričito to traži — time možeš zauvijek zaključati pristup.
- U reply-ju jasno navedi šta je promijenjeno i da Vercel objavljuje izmjenu za 1-2 minute. Ako je izmjena koda u toku (codeRequest), u reply-ju reci da pripremaš izmjenu koda.`;

const CODE_EDIT_INSTRUCTION = `Ti si asistent koji uređuje izvorni kod web stranice Vikendica AQUA (Next.js 15 App Router + Tailwind + TypeScript).
Dobivaš zahtjev administratora, plan iz prethodnog koraka i sadržaje relevantnih fajlova. Vrati:

- reply: kratku potvrdu na bosanskom šta je urađeno (1-2 rečenice), uz napomenu da Vercel objavljuje izmjenu za 1-2 minute i upozorenje da se izmjena može vratiti nazad ako nešto ne radi.
- codeEdits: niz izmjena — za svaki fajl KOMPLETAN novi sadržaj (ne diff, ne izostavljanje dijelova).

Pravila:
- Validan TypeScript/TSX koji prolazi kompilaciju; drži se postojećeg stila projekta (Tailwind klase, postojeći obrasci, bosanski tekstovi).
- Minimalna, ciljana izmjena — ne refaktoriši ništa što nije traženo.
- Dinamički sadržaj (tekstovi, cijene, slike) NE hardkodiraj — čitaj iz @/lib/content (site) kao što postojeće komponente rade.
- Nemoj mijenjati src/auth.ts, src/middleware.ts niti admin chat (src/app/api/admin/, src/app/admin/) osim ako je izričito traženo.
- Ako zahtjev nije moguće sigurno implementirati, vrati prazan codeEdits i objasni u reply-ju zašto.`;

export interface CodeEdit {
  path: string;
  content: string;
  summary: string;
}

export interface BookedDatesEdit {
  bookedDates: string[];
  bookedRanges: { start: string; end: string; note?: string }[];
}

export interface AdminImageInput {
  /** Javna putanja nakon GitHub commita, npr. /uploads/123-bazen.webp */
  path: string;
  mimeType: string;
  dataBase64: string;
}
export interface AdminEditResult {
  reply: string;
  siteData?: SiteData;
  bookedDates?: BookedDatesEdit;
  codeRequest?: { files: string[]; plan: string };
}

export interface AdminCodeEditResult {
  reply: string;
  codeEdits: CodeEdit[];
}

function newClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Nedostaje env varijabla: GEMINI_API_KEY");
  return new GoogleGenAI({ apiKey });
}

async function generate<T>(params: {
  systemInstruction: string;
  schema: Schema;
  parts: ({ text: string } | { inlineData: { mimeType: string; data: string } })[];
}): Promise<T> {
  const ai = newClient();
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [{ role: "user", parts: params.parts }],
    config: {
      systemInstruction: params.systemInstruction,
      responseMimeType: "application/json",
      responseSchema: params.schema,
      temperature: 0.2,
    },
  });
  const text = response.text;
  if (!text) throw new Error("Gemini nije vratio odgovor.");
  return JSON.parse(text) as T;
}

/** Faza 1: sadržaj/kalendar/pitanje + lista source fajlova za kod. */
export async function runAdminEdit(params: {
  message: string;
  currentData: SiteData;
  currentBooked: string;
  sourceFileList: string[];
  image?: AdminImageInput;
}): Promise<AdminEditResult> {
  const parts: ({ text: string } | { inlineData: { mimeType: string; data: string } })[] = [];

  if (params.image) {
    parts.push({
      inlineData: {
        mimeType: params.image.mimeType,
        data: params.image.dataBase64,
      },
    });
    parts.push({
      text: `Priložena slika je objavljena na putanji: ${params.image.path}`,
    });
  }

  parts.push({
    text: [
      `Trenutni content/site-data.json:\n\`\`\`json\n${JSON.stringify(params.currentData, null, 2)}\n\`\`\``,
      `Trenutni data/bookedDates.json:\n\`\`\`json\n${params.currentBooked}\n\`\`\``,
      `Postojeći source fajlovi (sadržaj dobivaš na zahtjev preko codeRequest):\n${params.sourceFileList.join("\n")}`,
      `Zahtjev administratora: ${params.message}`,
    ].join("\n\n"),
  });

  const parsed = await generate<AdminEditResult>({
    systemInstruction: SYSTEM_INSTRUCTION,
    schema: responseSchema,
    parts,
  });
  if (typeof parsed.reply !== "string") {
    throw new Error("Gemini odgovor nema očekivanu strukturu.");
  }
  return parsed;
}

/** Faza 2: izmjena koda — poziva se tek kad faza 1 vrati codeRequest. */
export async function runAdminCodeEdit(params: {
  message: string;
  plan: string;
  files: { path: string; text: string }[];
}): Promise<AdminCodeEditResult> {
  const fileContext = params.files.length
    ? params.files.map((f) => `--- ${f.path} ---\n${f.text}`).join("\n\n")
    : "(nijedan traženi fajl ne postoji — radi se o novim fajlovima)";

  const parsed = await generate<AdminCodeEditResult>({
    systemInstruction: CODE_EDIT_INSTRUCTION,
    schema: codeEditResponseSchema,
    parts: [
      {
        text: [
          `Plan izmjene: ${params.plan}`,
          `Sadržaji relevantnih fajlova:\n${fileContext}`,
          `Zahtjev administratora: ${params.message}`,
        ].join("\n\n"),
      },
    ],
  });
  if (typeof parsed.reply !== "string" || !Array.isArray(parsed.codeEdits)) {
    throw new Error("Gemini odgovor nema očekivanu strukturu (codeEdits).");
  }
  return parsed;
}
