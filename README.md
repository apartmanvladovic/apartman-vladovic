# Vikendica AQUA (Apartman Vladović)

Web stranica objekta Apartman Vladović, koji posluje pod brendom "Vikendica AQUA" — dnevni najam privatne vikendice sa bazenom, 20 minuta od Sarajeva.
Next.js (App Router, TypeScript) + Tailwind CSS, spremna za zero-config deploy na Vercel.

## 1. Lokalno pokretanje

```bash
npm install
npm run dev
```

Otvori [http://localhost:3000](http://localhost:3000).

## 2. Izmjena sadržaja

Sve na jednom mjestu: **`src/config/site.ts`** — naziv, slogan, telefon,
radno vrijeme, sadržaji, paketi i cijene, Premium pogodnosti, pravila kuće,
footer poruke.

Slike su placeholderi (Unsplash) definisani u `src/lib/images.ts` — pravim
fotografijama zamijenite tako što ih stavite u `public/images/` i
promijenite putanje.

## 3. Kontakt forma

Forma šalje upit emailom ako su env varijable podešene (vidi `.env.example`).
Ako nisu, korisniku se automatski ponudi **WhatsApp fallback** — upit se
formatira i otvara u WhatsAppu na broj vlasnika, pa sajt radi i bez ikakve
konfiguracije.

### Podešavanje emaila (opcionalno)

1. Kreirajte nalog na [resend.com](https://resend.com) i generišite API ključ.
2. Postavite env varijable:
   ```
   CONTACT_EMAIL=email-na-koji-stizu-upiti@gmail.com
   RESEND_API_KEY=re_xxxxxxxx
   ```
   Alternativa: Gmail App Password preko `SMTP_*` varijabli (vidi `.env.example`).

## 4. Deploy na Vercel

1. Pushujte repozitorij na GitHub.
2. Na [vercel.com](https://vercel.com) → **Add New → Project** → import repozitorija.
3. Vercel automatski prepoznaje Next.js — kliknite **Deploy**.
4. (Opcionalno) **Settings → Environment Variables** — dodajte varijable iz `.env.example`.
5. Svaki push na `main` automatski redeploya sajt.
