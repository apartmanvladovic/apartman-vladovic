# Apartman Vladović

Web stranica za najam apartmana sa privatnim bazenom u podnožju planine Igman.
Next.js (App Router, TypeScript) + Tailwind CSS, spremna za zero-config deploy na Vercel.

## 1. Lokalno pokretanje

Potreban je Node.js 18.18+ (ili Bun).

```bash
npm install
npm run dev
```

Otvori [http://localhost:3000](http://localhost:3000).

Produkcijski build:

```bash
npm run build && npm start
```

## 2. Izmjena zauzetih datuma u kalendaru

Sve je u fajlu **`data/bookedDates.json`**:

```json
{
  "bookedDates": ["2026-07-06", "2026-07-07"],
  "bookedRanges": [
    { "start": "2026-07-15", "end": "2026-07-22", "note": "Rezervacija" }
  ]
}
```

- `bookedDates` — pojedinačni zauzeti dani, format `YYYY-MM-DD`.
- `bookedRanges` — periodi: `start` = dan dolaska (zauzet), `end` = dan odlaska (**slobodan**, standardna Airbnb/Booking konvencija).

Nakon izmjene: commit + push — Vercel automatski redeploya.

### Sinhronizacija sa Airbnb/Booking kalendarom (opcionalno)

U Vercel env varijablama postavi:

```
ICAL_FEED_URLS=https://www.airbnb.com/calendar/ical/XXXX.ics,https://ical.booking.com/...
```

Feedovi se povlače automatski i keširaju 1 sat (ISR). Bez ove varijable kalendar čita samo lokalni JSON.

## 3. Deploy na Vercel

1. Pushuj repozitorij na GitHub.
2. Na [vercel.com](https://vercel.com) → **Add New → Project** → **Import GitHub repo**.
3. Vercel automatski prepoznaje Next.js — nikakve dodatne postavke nisu potrebne.
4. **Settings → Environment Variables** — dodaj varijable iz `.env.example` (vidi ispod).
5. **Deploy**. Svaki push na `main` automatski deploya novu verziju.

## 4. Podešavanje emaila (upiti sa kontakt forme)

Upiti se šalju na `apartmanvladovic@gmail.com`. Podržane su dvije opcije (odaberi jednu):

### Opcija A — Resend (preporučeno, besplatno do 100 emailova/dan)

1. Napravi nalog na [resend.com](https://resend.com).
2. Generiši API ključ (**API Keys → Create API Key**).
3. U Vercel env varijable dodaj:
   ```
   RESEND_API_KEY=re_xxxxxxxx
   EMAIL_FROM=Apartman Vladović <onboarding@resend.dev>
   ```
   Za test, `onboarding@resend.dev` šalje samo na email vlasnika Resend naloga.
   Za produkciju verifikuj svoju domenu u Resendu i stavi npr. `rezervacije@tvojadomena.com`.

### Opcija B — Gmail App Password (Nodemailer)

1. Na Gmail nalogu uključi **dvofaktorsku autentifikaciju (2FA)**.
2. Kreiraj App Password: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).
3. U Vercel env varijable dodaj:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_USER=apartmanvladovic@gmail.com
   SMTP_PASS=app-password-od-16-znakova
   ```

Ako nijedna opcija nije podešena, forma isporučuje jasnu poruku korisniku da kontaktira direktno — sajt i dalje radi normalno.

## 5. Izmjena tekstova, cijena i kontakt podataka

Sve na jednom mjestu: **`src/config/site.ts`**
(naziv, podnaslov, telefon, email, kapacitet, cjenovnik, pravila kuće, lokacija, udaljenosti, link za mapu).

## 6. Zamjena placeholder slika

Slike su definisane u **`src/lib/images.ts`**. Prave fotografije stavi u
`public/images/` (npr. `public/images/bazen.jpg`) i u `images.ts` zamijeni
`src` sa `"/images/bazen.jpg"`.

## Struktura projekta

```
data/bookedDates.json       # zauzeti datumi (vlasnik uređuje)
src/config/site.ts          # svi tekstovi, kontakti, cijene
src/lib/calendar.ts         # logika kalendara + iCal parser
src/lib/images.ts           # fotografije (placeholderi → public/images)
src/app/page.tsx            # glavna stranica (sekcije)
src/app/api/contact/route.ts# slanje upita (Resend / Nodemailer)
src/components/             # Navbar, Hero, About, Features, Gallery,
                            # AvailabilityCalendar, ContactForm, Location, Footer
```

## Environment varijable

Vidi **`.env.example`** — kopiraj u `.env.local` za lokalni razvoj.
Nikada ne commituj `.env.local` (već je u `.gitignore`).
