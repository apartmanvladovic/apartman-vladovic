"use client";

import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

import { SectionHeading } from "@/components/SectionHeading";

interface AvailabilityCalendarProps {
  /** ISO datumi (YYYY-MM-DD) koji su zauzeti */
  bookedDates: string[];
}

function parseISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function AvailabilityCalendar({ bookedDates }: AvailabilityCalendarProps) {
  // Broj mjeseci zavisi od širine ekrana: 1 (mobitel) / 2 (tablet) / 3 (desktop).
  const [months, setMonths] = useState(1);

  useEffect(() => {
    const compute = () =>
      setMonths(window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1);
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const booked = bookedDates.map(parseISO);

  return (
    <section id="kalendar" className="scroll-mt-20 bg-mist-100 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Dostupnost"
          title="Kalendar zauzetosti"
          description="Provjerite slobodne termine prije slanja upita. Zauzeti dani su precrtani."
        />

        <div className="mx-auto w-fit rounded-2xl border border-forest-100 bg-white p-4 shadow-sm sm:p-6">
          <DayPicker
            numberOfMonths={months}
            disabled={[{ before: new Date() }, ...booked]}
            modifiers={{ booked }}
            modifiersClassNames={{ booked: "rdp-day_booked" }}
            fixedWeeks
            showOutsideDays
          />

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-forest-100 pt-4 text-sm">
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-forest-400" aria-hidden />
              Slobodno
            </span>
            <span className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full bg-red-600/70"
                aria-hidden
              />
              <span className="text-red-700 line-through">Zauzeto</span>
            </span>
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-xl text-center text-sm text-forest-950/60">
          Ne vidite željeni termin? Pošaljite upit — moguće su izmjene i
          dogovor oko datuma.
        </p>
      </div>
    </section>
  );
}
