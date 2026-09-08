/**
 * GET  /api/admin/calendar — trenutno stanje zauzetosti iz repoa.
 * POST /api/admin/calendar — { bookedDates, bookedRanges } validira i
 *      commituje data/bookedDates.json.
 */
import { NextResponse } from "next/server";

import { auth, isAdmin } from "@/auth";
import {
  serializeBookedDates,
  validateBookedDates,
  type BookedDatesEdit,
} from "@/lib/calendar";
import { commitTextFile, getRepoFile } from "@/lib/github";

export const runtime = "nodejs";

const BOOKED_PATH = "data/bookedDates.json";

const EMPTY: BookedDatesEdit = { bookedDates: [], bookedRanges: [] };

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Niste prijavljeni." }, { status: 401 });
  }
  if (!isAdmin(session)) {
    return NextResponse.json({ error: "Pristup dozvoljen samo administratoru." }, { status: 403 });
  }

  try {
    const file = await getRepoFile(BOOKED_PATH);
    if (!file) return NextResponse.json(EMPTY);
    const parsed = JSON.parse(file.text) as Partial<BookedDatesEdit>;
    return NextResponse.json({
      bookedDates: Array.isArray(parsed.bookedDates) ? parsed.bookedDates : [],
      bookedRanges: Array.isArray(parsed.bookedRanges) ? parsed.bookedRanges : [],
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Čitanje kalendara nije uspjelo: ${msg}` }, { status: 502 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Niste prijavljeni." }, { status: 401 });
  }
  if (!isAdmin(session)) {
    return NextResponse.json({ error: "Pristup dozvoljen samo administratoru." }, { status: 403 });
  }

  let body: Partial<BookedDatesEdit>;
  try {
    body = (await req.json()) as Partial<BookedDatesEdit>;
  } catch {
    return NextResponse.json({ error: "Očekivan JSON body." }, { status: 400 });
  }

  const edit: BookedDatesEdit = {
    bookedDates: Array.isArray(body.bookedDates) ? body.bookedDates : [],
    bookedRanges: Array.isArray(body.bookedRanges) ? body.bookedRanges : [],
  };
  const errMsg = validateBookedDates(edit);
  if (errMsg) {
    return NextResponse.json({ error: errMsg }, { status: 400 });
  }

  try {
    await commitTextFile(BOOKED_PATH, serializeBookedDates(edit), "Admin kalendar: ručna izmjena");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `GitHub commit nije uspio: ${msg}` }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
