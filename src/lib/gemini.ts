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

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    reply: {
      type: Type.STRING,
      description: "Kratka poruka administratoru na bosanskom — šta je urađeno.",
    },
    data: siteDataSchema,
  },
  required: ["reply", "data"],
};

const SYSTEM_INSTRUCTION = `Ti si asistent koji uređuje sadržaj web stranice Vikendica AQUA (apartman/vikendica sa bazenom kod Sarajeva).
Administrator ti šalje zahtjev na bosanskom, a ti vraćaš:
- reply: kratku potvrdu na bosanskom šta si uradio (1-2 rečenice),
- data: KOMPLETAN ažurirani site-data JSON.

Pravila:
- UVIJEK vrati cijeli JSON sa svim poljima; mijenjaj samo ono što je administrator tražio, sve ostalo zadrži nepromijenjeno.
- Tekst piši na bosanskom, u istom tonu i stilu kao postojeći sadržaj.
- Putanje slika su relativne (npr. /images/hero.jpg ili /uploads/...). Nikad ne izmišljaj putanje — koristi samo postojeće ili onu koja ti je eksplicitno data uz priloženu sliku.
- Ako je uz poruku priložena slika, pogledaj je i iskoristi njen dati public path tamo gdje administrator traži (npr. images.hero.src ili nova stavka u images.gallery sa smislenim alt tekstom i kategorijom).
- Ako je poruka samo pitanje bez zahtjeva za izmjenom, odgovori u reply polju, a data vrati nepromijenjen.
- Cijene i novčane iznose mijenjaj samo ako je to eksplicitno traženo.`;

export interface AdminImageInput {
  /** Javna putanja nakon GitHub commita, npr. /uploads/123-bazen.webp */
  path: string;
  mimeType: string;
  dataBase64: string;
}

export interface AdminEditResult {
  reply: string;
  data: SiteData;
}

export async function runAdminEdit(params: {
  message: string;
  currentData: SiteData;
  image?: AdminImageInput;
}): Promise<AdminEditResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Nedostaje env varijabla: GEMINI_API_KEY");

  const ai = new GoogleGenAI({ apiKey });

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
    text: `Trenutni site-data.json:\n\`\`\`json\n${JSON.stringify(params.currentData, null, 2)}\n\`\`\`\n\nZahtjev administratora: ${params.message}`,
  });

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [{ role: "user", parts }],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema,
      temperature: 0.2,
    },
  });

  const text = response.text;
  if (!text) throw new Error("Gemini nije vratio odgovor.");

  const parsed = JSON.parse(text) as AdminEditResult;
  if (!parsed.data || typeof parsed.reply !== "string") {
    throw new Error("Gemini odgovor nema očekivanu strukturu.");
  }
  return parsed;
}
