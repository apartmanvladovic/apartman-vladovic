/**
 * POST /api/admin/chat — JSON { message, imagePath?, imageBase64?, imageMimeType? }.
 * Dohvata aktuelni site-data.json s GitHuba, šalje zahtjev Geminiju
 * (structured output), pa ako se sadržaj promijenio commituje novi JSON.
 */
import { NextResponse } from "next/server";

import { auth, isAdmin } from "@/auth";
import type { SiteData } from "@/lib/content";
import { runAdminEdit } from "@/lib/gemini";
import { commitTextFile, getRepoFile } from "@/lib/github";

export const runtime = "nodejs";
export const maxDuration = 60;

const SITE_DATA_PATH = "content/site-data.json";

interface ChatBody {
  message?: unknown;
  imagePath?: unknown;
  imageBase64?: unknown;
  imageMimeType?: unknown;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Niste prijavljeni." }, { status: 401 });
  }
  if (!isAdmin(session)) {
    return NextResponse.json({ error: "Pristup dozvoljen samo administratoru." }, { status: 403 });
  }

  let body: ChatBody;
  try {
    body = (await req.json()) as ChatBody;
  } catch {
    return NextResponse.json({ error: "Očekivan JSON body." }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) {
    return NextResponse.json({ error: "Poruka je prazna." }, { status: 400 });
  }

  const image =
    typeof body.imagePath === "string" &&
    typeof body.imageBase64 === "string" &&
    typeof body.imageMimeType === "string"
      ? {
          path: body.imagePath,
          dataBase64: body.imageBase64,
          mimeType: body.imageMimeType,
        }
      : undefined;

  // Aktuelni sadržaj — GitHub repo je izvor istine (lokalni fajl na
  // Vercelu je zastao čim je neki admin commit prošao bez redeploya).
  let current: SiteData;
  try {
    const file = await getRepoFile(SITE_DATA_PATH);
    if (!file) {
      return NextResponse.json(
        { error: `${SITE_DATA_PATH} ne postoji u repou.` },
        { status: 500 },
      );
    }
    current = JSON.parse(file.text) as SiteData;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Čitanje sadržaja s GitHuba nije uspjelo: ${msg}` }, { status: 502 });
  }

  let result;
  try {
    result = await runAdminEdit({ message, currentData: current, image });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Gemini greška: ${msg}` }, { status: 502 });
  }

  const before = JSON.stringify(current);
  const after = JSON.stringify(result.data);
  const changed = before !== after;

  if (changed) {
    const summary = message.replace(/\s+/g, " ").slice(0, 60);
    try {
      await commitTextFile(
        SITE_DATA_PATH,
        JSON.stringify(result.data, null, 2) + "\n",
        `Admin: ${summary}`,
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return NextResponse.json(
        { error: `Commit site-data.json nije uspio: ${msg}`, reply: result.reply },
        { status: 502 },
      );
    }
  }

  return NextResponse.json({ ok: true, reply: result.reply, changed });
}
