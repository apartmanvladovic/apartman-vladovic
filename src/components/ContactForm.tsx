"use client";

import { MessageCircle, Send } from "lucide-react";
import { useState } from "react";

import { useBookingRange } from "@/components/BookingProvider";
import { site } from "@/config/site";

type RentalType = "dnevni" | "nocenje";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "success" }
  | { kind: "error"; message: string; whatsappUrl?: string };

const inputClass =
  "w-full rounded border border-pine-950/15 bg-white px-3 py-2.5 text-sm text-pine-950 placeholder:text-pine-950/40 focus:border-pine-400 focus:outline-none focus:ring-1 focus:ring-pine-400";

const labelClass = "mb-1 block text-sm font-medium text-pine-800";

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [type, setType] = useState<RentalType>("dnevni");
  const [pkg, setPkg] = useState(site.packages[0].id);
  const { checkIn, checkOut, setRange } = useBookingRange();

  const selectedPkg = site.packages.find((p) => p.id === pkg) ?? site.packages[0];
  const guestLimit =
    type === "dnevni" ? selectedPkg.capacity : site.overnight.capacity.guests;

  function buildWhatsappUrl(data: FormData): string {
    const lines = [
      `Upit za rezervaciju — ${site.name}`,
      `Vrsta: ${type === "dnevni" ? "Dnevni najam" : "Noćenje"}`,
      `Ime: ${data.get("name")}`,
      `Telefon: ${data.get("phone")}`,
      type === "dnevni"
        ? `Datum: ${data.get("date")} · Paket: ${selectedPkg.name}`
        : `Termin: ${checkIn} → ${checkOut}`,
      `Broj osoba: ${data.get("guests")}`,
      data.get("order") ? `Dodatna narudžba: ${data.get("order")}` : null,
      data.get("message") ? `Poruka: ${data.get("message")}` : null,
    ].filter(Boolean);
    return `https://wa.me/${site.contact.phoneIntl}?text=${encodeURIComponent(lines.join("\n"))}`;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    setStatus({ kind: "sending" });
    setFieldErrors({});

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          name: data.get("name"),
          phone: data.get("phone"),
          date: data.get("date"),
          checkIn,
          checkOut,
          packageId: pkg,
          guests: Number(data.get("guests")),
          order: data.get("order"),
          message: data.get("message"),
        }),
      });
      const json = await res.json();

      if (res.ok) {
        setStatus({ kind: "success" });
        form.reset();
        setRange("", "");
      } else {
        if (json.errors) setFieldErrors(json.errors);
        setStatus({
          kind: "error",
          message: json.error ?? "Provjerite označena polja i pokušajte ponovo.",
          whatsappUrl: res.status === 503 ? buildWhatsappUrl(data) : undefined,
        });
      }
    } catch {
      setStatus({
        kind: "error",
        message: "Greška u mreži. Provjerite konekciju i pokušajte ponovo.",
      });
    }
  }

  const err = (name: string) =>
    fieldErrors[name] ? (
      <p className="mt-1 text-xs text-red-700">{fieldErrors[name]}</p>
    ) : null;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Vrsta najma */}
      <div className="grid grid-cols-2 gap-2 rounded bg-cream-100 p-1.5">
        {(["dnevni", "nocenje"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`rounded px-4 py-2.5 text-sm font-semibold transition-colors ${
              type === t
                ? "bg-pine-700 text-cream-50 shadow-sm"
                : "text-pine-950/60 hover:text-pine-800"
            }`}
          >
            {t === "dnevni" ? "Dnevni najam (09–20 h)" : "Noćenje"}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>Ime i prezime *</label>
          <input id="name" name="name" type="text" required className={inputClass} />
          {err("name")}
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>Telefon *</label>
          <input id="phone" name="phone" type="tel" required className={inputClass} placeholder="06X XXX XXX" />
          {err("phone")}
        </div>

        {type === "dnevni" ? (
          <>
            <div>
              <label htmlFor="date" className={labelClass}>Datum *</label>
              <input id="date" name="date" type="date" required className={inputClass} />
              {err("date")}
            </div>
            <div>
              <label htmlFor="package" className={labelClass}>Paket *</label>
              <select
                id="package"
                name="package"
                className={inputClass}
                value={pkg}
                onChange={(e) => setPkg(e.target.value as typeof pkg)}
              >
                {site.packages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — do {p.capacity} osoba
                  </option>
                ))}
              </select>
              {err("packageId")}
            </div>
          </>
        ) : (
          <>
            <div>
              <label htmlFor="checkIn" className={labelClass}>Datum dolaska *</label>
              <input
                id="checkIn"
                name="checkIn"
                type="date"
                required
                className={inputClass}
                value={checkIn}
                onChange={(e) =>
                  setRange(e.target.value, e.target.value <= checkOut ? checkOut : "")
                }
              />
              {err("checkIn")}
            </div>
            <div>
              <label htmlFor="checkOut" className={labelClass}>Datum odlaska *</label>
              <input
                id="checkOut"
                name="checkOut"
                type="date"
                required
                className={inputClass}
                value={checkOut}
                onChange={(e) => setRange(checkIn, e.target.value)}
              />
              {err("checkOut")}
            </div>
            <p className="text-xs text-pine-950/60 sm:col-span-2">
              Termin možete odabrati i klikom na kalendar u sekciji Noćenje.
            </p>
          </>
        )}

        <div>
          <label htmlFor="guests" className={labelClass}>Broj osoba *</label>
          <select id="guests" name="guests" required defaultValue="" className={inputClass}>
            <option value="" disabled>Odaberite</option>
            {Array.from({ length: guestLimit }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "osoba" : n < 5 ? "osobe" : "osoba"}
              </option>
            ))}
          </select>
          {err("guests")}
        </div>

        {type === "dnevni" && (
          <div>
            <label htmlFor="order" className={labelClass}>Dodatna narudžba (piće, potrepštine)</label>
            <input
              id="order"
              name="order"
              type="text"
              className={inputClass}
              placeholder="npr. 2 paketa sokova, led..."
            />
          </div>
        )}
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>Poruka</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className={inputClass}
          placeholder="Pitanja, posebne želje, vrijeme dolaska..."
        />
        {err("message")}
      </div>

      <button
        type="submit"
        disabled={status.kind === "sending"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-bold uppercase tracking-wide text-pine-950 transition-colors hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send className="h-4 w-4" aria-hidden />
        {status.kind === "sending" ? "Slanje..." : "Pošalji upit"}
      </button>

      {status.kind === "success" && (
        <p className="rounded bg-pine-50 px-4 py-3 text-sm text-pine-700">
          Hvala! Vaš upit je poslan — javit ćemo se u naj kraćem roku.
        </p>
      )}
      {status.kind === "error" && (
        <div className="rounded bg-red-50 px-4 py-3 text-sm text-red-700">
          <p>{status.message}</p>
          {status.whatsappUrl && (
            <a
              href={status.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-700 px-5 py-2.5 font-semibold text-white hover:bg-green-800"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              Pošalji upit preko WhatsApp
            </a>
          )}
        </div>
      )}
    </form>
  );
}
