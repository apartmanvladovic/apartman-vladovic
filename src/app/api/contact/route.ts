import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { Resend } from "resend";

import { site } from "@/config/site";

export const runtime = "nodejs";

interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  message: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function validate(body: Partial<ContactPayload>): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!body.name || body.name.trim().length < 2) {
    errors.name = "Unesite ime i prezime.";
  }
  if (!body.email || !EMAIL_RE.test(body.email)) {
    errors.email = "Unesite ispravnu email adresu.";
  }
  if (body.phone && body.phone.replace(/[^\d+]/g, "").length < 6) {
    errors.phone = "Unesite ispravan broj telefona.";
  }
  if (!body.checkIn || !ISO_DATE.test(body.checkIn)) {
    errors.checkIn = "Odaberite datum dolaska.";
  }
  if (!body.checkOut || !ISO_DATE.test(body.checkOut)) {
    errors.checkOut = "Odaberite datum odlaska.";
  }
  if (
    body.checkIn &&
    body.checkOut &&
    ISO_DATE.test(body.checkIn) &&
    ISO_DATE.test(body.checkOut) &&
    body.checkOut <= body.checkIn
  ) {
    errors.checkOut = "Datum odlaska mora biti nakon datuma dolaska.";
  }
  const guests = Number(body.guests);
  if (!Number.isInteger(guests) || guests < 1 || guests > site.capacity.guests) {
    errors.guests = `Broj gostiju mora biti između 1 i ${site.capacity.guests}.`;
  }
  if (body.message && body.message.length > 2000) {
    errors.message = "Poruka je preduga (maks. 2000 karaktera).";
  }

  return errors;
}

function buildEmailHtml(p: ContactPayload): string {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 12px;color:#555;vertical-align:top">${label}</td><td style="padding:6px 12px"><strong>${value}</strong></td></tr>`;
  return `
    <h2 style="color:#1b4332">Novi upit za rezervaciju — ${site.name}</h2>
    <table style="border-collapse:collapse;font-family:sans-serif">
      ${row("Ime i prezime", escapeHtml(p.name))}
      ${row("Email", `<a href="mailto:${escapeHtml(p.email)}">${escapeHtml(p.email)}</a>`)}
      ${row("Telefon", escapeHtml(p.phone) || "—")}
      ${row("Check-in", p.checkIn)}
      ${row("Check-out", p.checkOut)}
      ${row("Broj gostiju", String(p.guests))}
    </table>
    <p style="font-family:sans-serif"><strong>Poruka:</strong><br/>${escapeHtml(p.message || "—").replace(/\n/g, "<br/>")}</p>
  `;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendWithResend(
  to: string,
  subject: string,
  html: string,
  replyTo: string,
): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from:
      process.env.EMAIL_FROM ??
      `${site.name} <onboarding@resend.dev>`,
    to,
    replyTo,
    subject,
    html,
  });
  if (error) throw new Error(error.message);
}

async function sendWithSmtp(
  to: string,
  subject: string,
  html: string,
  replyTo: string,
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
    replyTo,
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
  const to = process.env.CONTACT_EMAIL ?? site.contact.email;
  const subject = `Upit za rezervaciju: ${payload.checkIn} → ${payload.checkOut} (${payload.name})`;
  const html = buildEmailHtml(payload);

  const hasResend = Boolean(process.env.RESEND_API_KEY);
  const hasSmtp = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER);

  if (!hasResend && !hasSmtp) {
    // Email servis nije konfigurisan — upit se loguje, klijent dobija
    // jasnu poruku da kontaktira direktno (vidi .env.example).
    console.warn("[contact] Email servis nije konfigurisan. Upit:", payload);
    return NextResponse.json(
      {
        error:
          "Slanje emaila trenutno nije konfigurisano. Molimo kontaktirajte nas direktno putem emaila ili WhatsApp/Viber dugmeta.",
      },
      { status: 503 },
    );
  }

  try {
    if (hasResend) {
      await sendWithResend(to, subject, html, payload.email);
    } else {
      await sendWithSmtp(to, subject, html, payload.email);
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Greška pri slanju emaila:", err);
    return NextResponse.json(
      {
        error:
          "Došlo je do greške pri slanju poruke. Pokušajte ponovo ili nas kontaktirajte direktno.",
      },
      { status: 502 },
    );
  }
}
