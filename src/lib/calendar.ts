import bookedDatesJson from "@data/bookedDates.json";

export interface BookedRange {
  start: string; // YYYY-MM-DD (check-in, zauzet)
  end: string; // YYYY-MM-DD (check-out, SLOBODAN)
  note?: string;
}

interface BookedDatesFile {
  bookedDates: string[];
  bookedRanges: BookedRange[];
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Raširi period [start, end) u niz zauzetih datuma.
 * Dan odjave (end) je slobodan — standardna konvencija (Airbnb/Booking).
 */
export function expandRange(range: BookedRange): string[] {
  if (!ISO_DATE.test(range.start) || !ISO_DATE.test(range.end)) return [];
  const out: string[] = [];
  const cursor = new Date(`${range.start}T00:00:00`);
  const end = new Date(`${range.end}T00:00:00`);
  while (cursor < end) {
    out.push(toISODate(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return out;
}

/**
 * Minimalni iCal parser: izvlači DTSTART/DTEND iz VEVENT blokova.
 * Dovoljan za Airbnb/Booking export feedove (DATE i DATE-TIME varijante).
 */
export function parseICal(ical: string): BookedRange[] {
  const unfolded = ical.replace(/\r?\n[ \t]/g, "");
  const ranges: BookedRange[] = [];
  const blocks = unfolded.split("BEGIN:VEVENT").slice(1);
  for (const block of blocks) {
    const vevent = block.split("END:VEVENT")[0];
    const startMatch = vevent.match(/DTSTART[^:\r\n]*:(\d{4})(\d{2})(\d{2})/);
    const endMatch = vevent.match(/DTEND[^:\r\n]*:(\d{4})(\d{2})(\d{2})/);
    if (!startMatch) continue;
    const start = `${startMatch[1]}-${startMatch[2]}-${startMatch[3]}`;
    // Ako nema DTEND, tretiraj kao jednodnevnu rezervaciju.
    const end = endMatch
      ? `${endMatch[1]}-${endMatch[2]}-${endMatch[3]}`
      : (() => {
          const d = new Date(`${start}T00:00:00`);
          d.setDate(d.getDate() + 1);
          return toISODate(d);
        })();
    ranges.push({ start, end });
  }
  return ranges;
}

/**
 * Učita zauzete datume:
 *  1. lokalni fajl data/bookedDates.json (uvijek),
 *  2. opcionalno eksterni iCal feedovi iz ICAL_FEED_URLS (zarezom odvojeni),
 *     keširani 1h (ISR) — npr. Airbnb/Booking sync.
 */
export async function getBookedDates(): Promise<Set<string>> {
  const file = bookedDatesJson as BookedDatesFile;
  const booked = new Set<string>(
    file.bookedDates.filter((d) => ISO_DATE.test(d)),
  );
  for (const range of file.bookedRanges ?? []) {
    for (const d of expandRange(range)) booked.add(d);
  }

  const feedUrls = (process.env.ICAL_FEED_URLS ?? "")
    .split(",")
    .map((u) => u.trim())
    .filter(Boolean);

  for (const url of feedUrls) {
    try {
      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (!res.ok) continue;
      for (const range of parseICal(await res.text())) {
        for (const d of expandRange(range)) booked.add(d);
      }
    } catch {
      // Feed nedostupan — kalendar i dalje radi sa lokalnim podacima.
    }
  }

  return booked;
}
