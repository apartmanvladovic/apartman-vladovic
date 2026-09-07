import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { Resend } from "resend";

import { site } from "@/config/site";

export const runtime = "nodejs";

interface ContactPayload {
  name: string;
  phone: string;
  date: string;
  packageId: string;
  guests: number;
  order?: string;
  message?: string;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function todayISO(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function validate(body: Partial<ContactPayload>): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!body.name || body.name.trim().length < 2) {
    errors.name = "Unesite ime i prezime.";
  }
  if (!body.phone || body.phone.replace(/[^\d+]/g, "").length < 6) {
    errors.phone = "Unesite ispravan broj telefona.";
  }
  if (!body.date || !ISO_DATE.test(body.date)) {
    errors.date = "Odaberite datum.";
  } else if (body.date < todayISO()) {
    errors.date = "Datum ne može biti u prošlosti.";
  }
  const pkg = site.packages.find((p) => p.id === body.packageId);
  if (!pkg) {
    errors.packageId = "Odaberite paket.";
  } else {
    const guests = Number(body.guests);
    if (!Number.isInteger(guests) || guests < 1 || guests > pkg.capacity) {
      errors.guests = `Broj osoba za odabrani paket mora biti između 1 i ${pkg.capacity}.`;
    }
  }
  if (body.message && body.message.length > 2000) {
    errors.message = "Poruka je preduga (maks. 2000 karaktera).";
  }

  return errors;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildEmailHtml(p: ContactPayload): string {
  const pkg = site.packages.find((x) => x.id === p.packageId);
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 12px;color:#555;vertical-align:top">${label}</td><td style="padding:6px 12px"><strong>${value}</strong></td></tr>`;
  return `
    <h2 style="color:#0f3d2e">Novi upit za rezervaciju — ${site.name}</h2>
    <table style="border-collapse:collapse;font-family:sans-serif">
      ${row("Ime i prezime", escapeHtml(p.name))}
      ${row("Telefon", `<a href="tel:${escapeHtml(p.phone)}">${escapeHtml(p.phone)}</a>`)}
      ${row("Datum", p.date)}
      ${row("Paket", pkg ? `${pkg.name} (do ${pkg.capacity} osoba)` : p.packageId)}
      ${row("Broj osoba", String(p.guests))}
      ${row("Dodatna narudžba", escapeHtml(p.order || "—"))}
    </table>
    <p style="font-family:sans-serif"><strong>Poruka:</strong><br/>${escapeHtml(p.message || "—").replace(/\n/g, "<br/>")}</p>
  `;
}

async function sendWithResend(
  to: string,
  subject: string,
  html: string,
): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? `${site.name} <onboarding@resend.dev>`,
    to,
    subject,
    html,
  });
  if (error) throw new Error(error.message);
}

async function sendWithSmtp(
  to: string,
  subject: string,
  html: string,
): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: Number(process.env.SMTP_PORT ?? 465) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  await transporter.sendMail({
    from: process.env.EMAIL_FROM ?? process.env.SMTP_USER,
    to,
    subject,
    html,
  });
}

export async function POST(request: Request) {
  let body: Partial<ContactPayload>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Neispravan zahtjev." }, { status: 400 });
  }

  const errors = validate(body);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const payload = body as ContactPayload;
  const to = process.env.CONTACT_EMAIL;
  const hasProvider = Boolean(
    process.env.RESEND_API_KEY || (process.env.SMTP_HOST && process.env.SMTP_USER),
  );

  if (!to || !hasProvider) {
    // Email nije konfigurisan — klijent dobija 503 i nudi WhatsApp fallback.
    console.warn("[contact] Email servis nije konfigurisan. Upit:", payload);
    return NextResponse.json(
      {
        error:
          "Online slanje trenutno nije aktivno. Upit možete poslati direktno preko WhatsApp dugmeta ispod ili pozivom.",
      },
      { status: 503 },
    );
  }

  const pkg = site.packages.find((p) => p.id === payload.packageId);
  const subject = `Rezervacija ${payload.date} — ${pkg?.name ?? payload.packageId} (${payload.name})`;
  const html = buildEmailHtml(payload);

  try {
    if (process.env.RESEND_API_KEY) {
      await sendWithResend(to, subject, html);
    } else {
      await sendWithSmtp(to, subject, html);
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Greška pri slanju emaila:", err);
    return NextResponse.json(
      { error: "Došlo je do greške pri slanju. Pokušajte ponovo ili nas pozovite." },
      { status: 502 },
    );
  }
}
