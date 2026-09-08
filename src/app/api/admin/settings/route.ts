/**
 * GET  /api/admin/settings — { current, providers[] } za Postavke tab.
 * POST /api/admin/settings — { provider } validira i commituje
 *      data/admin-settings.json (Vercel redeploya; chat ga čita po zahtjevu).
 */
import { NextResponse } from "next/server";

import { auth, isAdmin } from "@/auth";
import { ADMIN_SETTINGS_PATH, readAdminSettings } from "@/lib/adminSettings";
import { commitTextFile } from "@/lib/github";
import { listProviders } from "@/lib/llm";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Niste prijavljeni." }, { status: 401 });
  }
  if (!isAdmin(session)) {
    return NextResponse.json({ error: "Pristup dozvoljen samo administratoru." }, { status: 403 });
  }

  const settings = await readAdminSettings();
  return NextResponse.json({ current: settings.llmProvider, providers: listProviders() });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Niste prijavljeni." }, { status: 401 });
  }
  if (!isAdmin(session)) {
    return NextResponse.json({ error: "Pristup dozvoljen samo administratoru." }, { status: 403 });
  }

  let body: { provider?: unknown };
  try {
    body = (await req.json()) as { provider?: unknown };
  } catch {
    return NextResponse.json({ error: "Očekivan JSON body." }, { status: 400 });
  }

  const provider = typeof body.provider === "string" ? body.provider : "";
  const info = listProviders().find((p) => p.id === provider);
  if (!info) {
    return NextResponse.json({ error: `Nepoznat provider: ${provider}` }, { status: 400 });
  }
  if (!info.configured) {
    return NextResponse.json(
      { error: `Provider ${info.label} nije konfigurisan (nedostaje mu API ključ u env varijablama).` },
      { status: 400 },
    );
  }

  const settings = { llmProvider: provider };
  try {
    await commitTextFile(
      ADMIN_SETTINGS_PATH,
      JSON.stringify(settings, null, 2) + "\n",
      `Admin postavke: LLM provider = ${provider}`,
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `GitHub commit nije uspio: ${msg}` }, { status: 502 });
  }

  return NextResponse.json({ ok: true, current: provider });
}
