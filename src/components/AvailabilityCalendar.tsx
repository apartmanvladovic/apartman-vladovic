"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useBookingRange } from "@/components/BookingProvider";

interface AvailabilityCalendarProps {
  /** ISO datumi (YYYY-MM-DD) koji su zauzeti */
  bookedDates: string[];
}

const MONTHS = [
  "Januar", "Februar", "Mart", "April", "Maj", "Juni",
  "Juli", "August", "Septembar", "Oktobar", "Novembar", "Decembar",
];
const WEEKDAYS = ["Pon", "Uto", "Sri", "Čet", "Pet", "Sub", "Ned"];

function toISO(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function todayISO(): string {
  const now = new Date();
  return toISO(now.getFullYear(), now.getMonth(), now.getDate());
}

function humanDate(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return `${d}. ${MONTHS[m - 1].toLowerCase()} ${y}.`;
}

interface Cell {
  iso: string | null;
  day: number | null;
}

function monthCells(year: number, month: number): Cell[] {
  // Sedmica počinje ponedjeljkom.
  const lead = (new Date(year, month, 1).getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const cells: Cell[] = Array.from({ length: lead }, () => ({ iso: null, day: null }));
  for (let d = 1; d <= days; d++) cells.push({ iso: toISO(year, month, d), day: d });
  return cells;
}

export function AvailabilityCalendar({ bookedDates }: AvailabilityCalendarProps) {
  const booked = useMemo(() => new Set(bookedDates), [bookedDates]);
  const { checkIn, checkOut, setRange } = useBookingRange();

  // Broj prikazanih mjeseci zavisi od širine ekrana: 1 / 2 / 3.
  const [monthsShown, setMonthsShown] = useState(1);
  const [offset, setOffset] = useState(0); // pomjeraj od trenutnog mjeseca

  useEffect(() => {
    const compute = () =>
      setMonthsShown(window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1);
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const today = todayISO();
  const base = new Date();
  const months = Array.from({ length: monthsShown }, (_, i) => {
    const d = new Date(base.getFullYear(), base.getMonth() + offset + i, 1);
    return { year: d.getFullYear(), month: d.getMonth(), cells: monthCells(d.getFullYear(), d.getMonth()) };
  });

  function pick(iso: string) {
    if (iso < today || booked.has(iso)) return;
    const hasFullRange = checkIn && checkOut;
    const crossesBooked =
      checkIn && bookedDates.some((b) => b > checkIn && b < iso);
    if (!checkIn || hasFullRange || iso <= checkIn || crossesBooked) {
      setRange(iso, "");
    } else {
      setRange(checkIn, iso);
    }
  }

  function cellClass(iso: string): string {
    if (iso < today)
      return "bg-transparent text-pine-950/25 border border-transparent cursor-default";
    if (booked.has(iso))
      return "bg-red-200 text-red-800 border border-red-400 line-through cursor-not-allowed";
    if (iso === checkIn || (checkOut && iso === checkOut))
      return "bg-green-700 text-white border border-green-700 font-bold hover:bg-green-800";
    if (checkIn && checkOut && iso > checkIn && iso < checkOut)
      return "bg-green-200 text-green-900 border border-green-300 hover:bg-green-300";
    return "bg-green-100 text-green-800 border border-green-300 hover:bg-green-200";
  }

  const nights =
    checkIn && checkOut
      ? Math.round(
          (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000,
        )
      : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded border border-pine-950/10 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <button
              type="button"
              aria-label="Prethodni mjesec"
              disabled={offset === 0}
              onClick={() => setOffset((o) => Math.max(0, o - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-pine-950/15 text-pine-700 transition-colors hover:border-pine-700 disabled:cursor-default disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Sljedeći mjesec"
              onClick={() => setOffset((o) => o + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-pine-950/15 text-pine-700 transition-colors hover:border-pine-700"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {months.map(({ year, month, cells }) => (
              <div key={`${year}-${month}`} className="[&:nth-child(n+3)]:hidden lg:[&:nth-child(n+3)]:block [&:nth-child(n+2)]:hidden sm:[&:nth-child(n+2)]:block">
                <p className="mb-3 text-center text-lg text-pine-700">
                  {MONTHS[month]} {year}
                </p>
                <div className="mb-1.5 grid grid-cols-7 gap-1">
                  {WEEKDAYS.map((d) => (
                    <span
                      key={d}
                      className="text-center text-[10px] font-semibold uppercase tracking-wider text-pine-950/40"
                    >
                      {d}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {cells.map((cell, i) =>
                    cell.iso === null ? (
                      <span key={`empty-${i}`} />
                    ) : (
                      <button
                        key={cell.iso}
                        type="button"
                        onClick={() => pick(cell.iso!)}
                        disabled={cell.iso < today || booked.has(cell.iso)}
                        className={`flex aspect-square items-center justify-center rounded text-sm transition-colors ${cellClass(cell.iso)}`}
                      >
                        {cell.day}
                      </button>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-pine-950/10 pt-5 sm:flex-row">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 rounded bg-green-100 border border-green-300" aria-hidden />
                Slobodno
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 rounded bg-red-200 border border-red-400" aria-hidden />
                Zauzeto
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 rounded bg-green-700" aria-hidden />
                Vaš odabir
              </span>
            </div>
            <p className="text-sm text-pine-950/70">
              {checkIn && checkOut
                ? `${humanDate(checkIn)} → ${humanDate(checkOut)} · ${nights} ${nights === 1 ? "noć" : "noći"}`
                : checkIn
                  ? `Dolazak ${humanDate(checkIn)} — odaberite datum odlaska.`
                  : "Još nije odabran termin."}
            </p>
          </div>
        </div>
    </div>
  );
}
