"use client";

import { MessageCircle, Send } from "lucide-react";
import { useState } from "react";

import { site } from "@/config/site";

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
  const [pkg, setPkg] = useState(site.packages[0].id);

  const selectedPkg = site.packages.find((p) => p.id === pkg) ?? site.packages[0];

  function buildWhatsappUrl(data: FormData): string {
    const lines = [
      `Upit za rezervaciju — ${site.name}`,
      `Ime: ${data.get("name")}`,
      `Telefon: ${data.get("phone")}`,
      `Datum: ${data.get("date")}`,
      `Paket: ${selectedPkg.name}`,
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
          name: data.get("name"),
          phone: data.get("phone"),
          date: data.get("date"),
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
      } else {
        if (json.errors) setFieldErrors(json.errors);
        setStatus({
          kind: "error",
          message: json.error ?? "Provjerite označena polja i pokušajte ponovo.",
          // Ako email nije konfigurisan, ponudi WhatsApp kao alternativu.
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
        <div>
          <label htmlFor="guests" className={labelClass}>Broj osoba *</label>
          <select id="guests" name="guests" required defaultValue="" className={inputClass}>
            <option value="" disabled>Odaberite</option>
            {Array.from({ length: selectedPkg.capacity }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "osoba" : n < 5 ? "osobe" : "osoba"}
              </option>
            ))}
          </select>
          {err("guests")}
        </div>
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

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={status.kind === "sending"}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-bold uppercase tracking-wide text-pine-950 transition-colors hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send className="h-4 w-4" aria-hidden />
          {status.kind === "sending" ? "Slanje..." : "Pošalji upit"}
        </button>
      </div>

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
