"use client";

/**
 * Admin editor zauzetosti — direktno označavanje datuma bez chata.
 * Klik na slobodan dan: početak odabira. Drugi klik:
 *  - isti dan → pojedinačni zauzet datum,
 *  - kasniji dan → period (drugi klik je ZADNJI zauzeti dan; u fajl ide
 *    end = dan poslije, jer je dan odjave slobodan po Airbnb konvenciji).
 * Klik na zauzet dan: oslobađa ga (uklanja pojedinačni datum ili cijeli period).
 */
import { CalendarDays, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { expandRange, type BookedDatesEdit, type BookedRange } from "@/lib/calendar";

const MONTHS = [
  "Januar", "Februar", "Mart", "April", "Maj", "Juni",
  "Juli", "August", "Septembar", "Oktobar", "Novembar", "Decembar",
];
const WEEKDAYS = ["Pon", "Uto", "Sri", "Čet", "Pet", "Sub", "Ned"];

function toISO(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function dayAfter(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + 1);
  return toISO(d.getFullYear(), d.getMonth(), d.getDate());
}

interface Cell {
  iso: string | null;
  day: number | null;
}

function monthCells(year: number, month: number): Cell[] {
  const lead = (new Date(year, month, 1).getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const cells: Cell[] = Array.from({ length: lead }, () => ({ iso: null, day: null }));
  for (let d = 1; d <= days; d++) cells.push({ iso: toISO(year, month, d), day: d });
  return cells;
}

export function ReservationCalendar() {
  const [singles, setSingles] = useState<string[]>([]);
  const [ranges, setRanges] = useState<BookedRange[]>([]);
  const [loaded, setLoaded] = useState<BookedDatesEdit | null>(null);
  const [pendingStart, setPendingStart] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [busy, setBusy] = useState<"load" | "save" | null>("load");
  const [notice, setNotice] = useState<{ text: string; error?: boolean } | null>(null);

  async function reload() {
    setBusy("load");
    try {
      const res = await fetch("/api/admin/calendar", { cache: "no-store" });
      const json = (await res.json()) as BookedDatesEdit & { error?: string };
      if (!res.ok) throw new Error(json.error || `Greška (${res.status}).`);
      const edit = { bookedDates: json.bookedDates, bookedRanges: json.bookedRanges };
      setSingles(edit.bookedDates);
      setRanges(edit.bookedRanges);
      setLoaded(edit);
      setPendingStart(null);
    } catch (err) {
      setNotice({ text: err instanceof Error ? err.message : String(err), error: true });
    } finally {
      setBusy(null);
    }
  }

  useEffect(() => {
    void reload();
  }, []);

  const covered = useMemo(() => {
    const set = new Set(singles);
    for (const r of ranges) for (const d of expandRange(r)) set.add(d);
    return set;
  }, [singles, ranges]);

  const dirty =
    loaded !== null &&
    (JSON.stringify([...singles].sort()) !== JSON.stringify([...loaded.bookedDates].sort()) ||
      JSON.stringify(ranges) !== JSON.stringify(loaded.bookedRanges));

  function pick(iso: string) {
    setNotice(null);
    if (covered.has(iso)) {
      // Oslobodi: skini pojedinačni datum ili cijeli period koji ga pokriva.
      if (singles.includes(iso)) {
        setSingles(singles.filter((d) => d !== iso));
      } else {
        setRanges(ranges.filter((r) => !expandRange(r).includes(iso)));
      }
      setPendingStart(null);
      return;
    }
    if (pendingStart === null || iso < pendingStart) {
      setPendingStart(iso);
      return;
    }
    if (iso === pendingStart) {
      setSingles([...singles, iso]);
      setPendingStart(null);
      return;
    }
    setRanges([...ranges, { start: pendingStart, end: dayAfter(iso) }]);
    setPendingStart(null);
  }

  async function save() {
    setBusy("save");
    setNotice(null);
    try {
      const res = await fetch("/api/admin/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookedDates: singles, bookedRanges: ranges }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error || `Greška (${res.status}).`);
      setLoaded({ bookedDates: singles, bookedRanges: ranges });
      setNotice({ text: "Objavljeno! Kalendar na stranici osvježava se za minut-dva." });
    } catch (err) {
      setNotice({ text: err instanceof Error ? err.message : String(err), error: true });
    } finally {
      setBusy(null);
    }
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + offset;
  const view = new Date(year, month, 1);
  const cells = monthCells(view.getFullYear(), view.getMonth());

  function cellClass(iso: string): string {
    if (covered.has(iso)) return "bg-red-600 text-cream-50 font-semibold";
    if (iso === pendingStart) return "bg-gold text-pine-950 font-semibold";
    return "bg-white text-pine-900 border border-pine-100";
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4">
      <div className="mx-auto w-full max-w-md">
        <p className="mb-3 flex items-center gap-2 text-sm text-pine-950/70">
          <CalendarDays className="h-4 w-4 text-pine-600" />
          Kliknite dan za početak, pa zadnji dan perioda — ili jedan dan dva puta za
          pojedinačni datum. Klik na crveni dan ga oslobađa.
        </p>

        <div className="rounded-2xl border border-pine-100 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setOffset(offset - 1)}
              aria-label="Prethodni mjesec"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-pine-200 text-pine-700"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <p className="text-sm font-semibold text-pine-900">
              {MONTHS[view.getMonth()]} {view.getFullYear()}
            </p>
            <button
              type="button"
              onClick={() => setOffset(offset + 1)}
              aria-label="Sljedeći mjesec"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-pine-200 text-pine-700"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-pine-950/50">
            {WEEKDAYS.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {cells.map((c, i) =>
              c.iso ? (
                <button
                  key={i}
                  type="button"
                  onClick={() => pick(c.iso!)}
                  disabled={busy !== null}
                  className={`flex h-10 items-center justify-center rounded-lg text-sm transition disabled:opacity-60 ${cellClass(c.iso)}`}
                >
                  {c.day}
                </button>
              ) : (
                <span key={i} />
              ),
            )}
          </div>

          {busy === "load" ? (
            <p className="mt-3 flex items-center gap-2 text-xs text-pine-950/60">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Učitavam kalendar…
            </p>
          ) : null}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => void save()}
            disabled={!dirty || busy !== null}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-pine-700 text-sm font-semibold text-cream-50 transition hover:bg-pine-600 disabled:opacity-50"
          >
            {busy === "save" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Sačuvaj izmjene
          </button>
          <button
            type="button"
            onClick={() => void reload()}
            disabled={!dirty || busy !== null}
            className="h-11 rounded-full border border-pine-200 px-5 text-sm font-semibold text-pine-700 transition hover:bg-pine-50 disabled:opacity-50"
          >
            Poništi
          </button>
        </div>

        {notice ? (
          <p
            className={`mt-3 rounded-xl px-4 py-2.5 text-sm ${
              notice.error
                ? "border border-red-200 bg-red-50 text-red-800"
                : "border border-pine-100 bg-white text-pine-900"
            }`}
          >
            {notice.text}
          </p>
        ) : null}

        {pendingStart ? (
          <p className="mt-2 text-xs text-pine-950/60">
            Početak: {pendingStart.split("-").reverse().join(".")}. — sada kliknite zadnji dan
            perioda (ili isti dan za pojedinačnu rezervaciju).
          </p>
        ) : null}
      </div>
    </div>
  );
}
