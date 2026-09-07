"use client";

import { Send } from "lucide-react";
import { useState } from "react";

import { useBookingRange } from "@/components/BookingProvider";
import { site } from "@/config/site";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "success" }
  | { kind: "error"; message: string };

const inputClass =
  "w-full rounded border border-brand-950/15 bg-white px-3 py-2.5 text-sm text-brand-950 placeholder:text-brand-950/40 focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400";

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { checkIn, checkOut, setRange } = useBookingRange();

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
          email: data.get("email"),
          phone: data.get("phone"),
          checkIn: data.get("checkIn"),
          checkOut: data.get("checkOut"),
          guests: Number(data.get("guests")),
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
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-brand-800">
            Ime i prezime *
          </label>
          <input id="name" name="name" type="text" required className={inputClass} />
          {err("name")}
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-brand-800">
            Email adresa *
          </label>
          <input id="email" name="email" type="email" required className={inputClass} />
          {err("email")}
        </div>
        <div>
          <label htmlFor="phone" className="mb-1 block text-sm font-medium text-brand-800">
            Telefon
          </label>
          <input id="phone" name="phone" type="tel" className={inputClass} placeholder="+387 ..." />
          {err("phone")}
        </div>
        <div>
          <label htmlFor="guests" className="mb-1 block text-sm font-medium text-brand-800">
            Broj gostiju *
          </label>
          <select id="guests" name="guests" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Odaberite
            </option>
            {Array.from({ length: site.capacity.guests }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "gost" : n < 5 ? "gosta" : "gostiju"}
              </option>
            ))}
          </select>
          {err("guests")}
        </div>
        <div>
          <label htmlFor="checkIn" className="mb-1 block text-sm font-medium text-brand-800">
            Datum dolaska *
          </label>
          <input
            id="checkIn"
            name="checkIn"
            type="date"
            required
            className={inputClass}
            value={checkIn}
            onChange={(e) => setRange(e.target.value, e.target.value <= checkOut ? checkOut : "")}
          />
          {err("checkIn")}
        </div>
        <div>
          <label htmlFor="checkOut" className="mb-1 block text-sm font-medium text-brand-800">
            Datum odlaska *
          </label>
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
      </div>

      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium text-brand-800">
          Poruka
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className={inputClass}
          placeholder="Pitanja, posebne želje, procijenjeno vrijeme dolaska..."
        />
        {err("message")}
      </div>

      <button
        type="submit"
        disabled={status.kind === "sending"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-7 py-3 font-semibold text-white transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        <Send className="h-4 w-4" aria-hidden />
        {status.kind === "sending" ? "Slanje..." : "Pošalji upit"}
      </button>

      {status.kind === "success" && (
        <p className="rounded bg-brand-50 px-4 py-3 text-sm text-brand-700">
          Hvala! Vaš upit je poslan — javit ćemo se u naj kraćem roku.
        </p>
      )}
      {status.kind === "error" && (
        <p className="rounded bg-red-50 px-4 py-3 text-sm text-red-700">
          {status.message}
        </p>
      )}
    </form>
  );
}
