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

Sav dinamički sadržaj (tekstovi, cijene, paketi, pravila, putanje slika) je u
**`content/site-data.json`** — to je jedini izvor istine. Sajt ga učitava pri
buildu preko `src/lib/content.ts` (tipizirano).

Sadržaj se mijenja na dva načina:

1. **Admin chat na `/admin`** (preporučeno, radi i s telefona) — vidi sekciju 3.
2. **Ručno** — uredite `content/site-data.json` i pushajte na GitHub.

Postojeće slike su u `public/images/`; admin-uploadovane slike idu u
`public/uploads/` (putanje `/uploads/...` u JSON-u).

## 3. Admin chat (`/admin`) — uređivanje sadržaja s telefona

`/admin` je zaštićen chat: prijavite se Google nalogom, opišite šta želite
("promijeni cijenu Paketa 1 na 280 KM") ili priložite sliku ("postavi ovo kao
hero sliku"). Gemini 2.5 Flash ažurira `content/site-data.json`, slika se
komituje u `public/uploads/`, a sve ide kao Git commit → Vercel automatski
redeploya sajt za minut-dva.

Pristup ima **isključivo** email iz `ADMIN_ALLOWED_EMAIL` — ostali dobijaju 403.

### Podešavanje (jednokratno)

1. **Google OAuth** — [console.cloud.google.com](https://console.cloud.google.com)
   → APIs & Services → Credentials → **Create OAuth client ID** (Web):
   - Authorized redirect URI: `https://VASA-DOMENA/api/auth/callback/google`
     (za lokalni razvoj i `http://localhost:3000/api/auth/callback/google`)
   - Kopirajte Client ID/Secret u `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`.
2. **`AUTH_SECRET`** — generišite sa `npx auth secret`.
3. **`ADMIN_ALLOWED_EMAIL`** — Google email vlasnika.
4. **Gemini ključ** — [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
   → `GEMINI_API_KEY`.
5. **GitHub token** — [github.com/settings/personal-access-tokens](https://github.com/settings/personal-access-tokens)
   → Fine-grained token, samo repo sajta, permission **Contents: Read and Write**
   → `GITHUB_TOKEN`, plus `GITHUB_REPO_OWNER`, `GITHUB_REPO_NAME`, `GITHUB_BRANCH`.
6. Na **Vercelu** dodajte sve varijable iz `.env.example` (Production) i još
   `AUTH_TRUST_HOST=true`, pa **Redeploy**.

## 4. Kontakt forma

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

## 5. Deploy na Vercel

1. Pushujte repozitorij na GitHub.
2. Na [vercel.com](https://vercel.com) → **Add New → Project** → import repozitorija.
3. Vercel automatski prepoznaje Next.js — kliknite **Deploy**.
4. (Opcionalno) **Settings → Environment Variables** — dodajte varijable iz `.env.example`.
5. Svaki push na `main` automatski redeploya sajt.
