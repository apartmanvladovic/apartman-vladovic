/**
 * POST /api/admin/chat — JSON { message, imagePath?, imageBase64?, imageMimeType? }.
 * Dohvata aktuelno stanje s GitHuba (site-data.json, bookedDates.json i
 * izvorni kod), šalje zahtjev aktivnom LLM provideru (structured output),
 * pa commituje sve što se promijenilo: sadržaj, kalendar i/ili fajlove koda.
 */
import { NextResponse } from "next/server";

import { auth, isAdmin } from "@/auth";
import { getActiveLlmProvider } from "@/lib/adminSettings";
import { serializeBookedDates, validateBookedDates, type BookedDatesEdit } from "@/lib/calendar";
import type { SiteData } from "@/lib/content";
import { runAdminCodeEdit, runAdminEdit } from "@/lib/gemini";
import { commitTextFile, getRepoFile, getRepoFiles, listSourceFiles } from "@/lib/github";
import type { LlmProvider } from "@/lib/llm";

export const runtime = "nodejs";
export const maxDuration = 60;

const SITE_DATA_PATH = "content/site-data.json";
const BOOKED_PATH = "data/bookedDates.json";

/** Model smije pisati samo po ovim putanjama — nikad .env, package.json, auth. */
const CODE_EDIT_ALLOW =
  /^src\/(?!auth\.ts$|middleware\.ts$|app\/api\/admin\/|app\/admin\/).+\.(ts|tsx|css)$/;

interface ChatBody {
  message?: unknown;
  imagePath?: unknown;
  imageBase64?: unknown;
  imageMimeType?: unknown;
}

function validateSiteData(data: unknown): data is SiteData {
  if (!data || typeof data !== "object") return false;
  const keys = [
    "name", "slogan", "tagline", "hours", "cta", "contact", "hero",
    "overnight", "location", "amenities", "packages", "premiumIncludes",
    "drinksService", "rules", "finale", "footerRules", "images",
  ];
  return keys.every((k) => k in (data as Record<string, unknown>));
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

  // Aktuelno stanje — GitHub repo je izvor istine (lokalni fajl na Vercelu
  // je zastao čim je neki admin commit prošao bez redeploya).
  let current: SiteData;
  let bookedRaw: string;
  let sourcePaths: string[];
  let provider: LlmProvider;
  try {
    const [siteFile, bookedFile, paths, activeProvider] = await Promise.all([
      getRepoFile(SITE_DATA_PATH),
      getRepoFile(BOOKED_PATH),
      listSourceFiles(),
      getActiveLlmProvider(),
    ]);
    provider = activeProvider;
    sourcePaths = paths;
    if (!siteFile) {
      return NextResponse.json(
        { error: `${SITE_DATA_PATH} ne postoji u repou.` },
        { status: 500 },
      );
    }
    current = JSON.parse(siteFile.text) as SiteData;
    bookedRaw = bookedFile?.text ?? `{ "bookedDates": [], "bookedRanges": [] }`;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Čitanje repoa s GitHuba nije uspjelo: ${msg}` }, { status: 502 });
  }

  let result;
  try {
    result = await runAdminEdit(provider, {
      message,
      currentData: current,
      currentBooked: bookedRaw,
      sourceFileList: sourcePaths,
      image,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Gemini greška: ${msg}` }, { status: 502 });
  }

  const summary = message.replace(/\s+/g, " ").slice(0, 60);
  const committed: string[] = [];

  try {
    // 1) Sadržaj sajta
    if (result.siteData !== undefined) {
      if (!validateSiteData(result.siteData)) {
        return NextResponse.json(
          { error: "Gemini je vratio nepotpun siteData (nedostaju polja). Ništa nije objavljeno.", reply: result.reply },
          { status: 502 },
        );
      }
      const nextJson = JSON.stringify(result.siteData, null, 2) + "\n";
      if (JSON.stringify(current) !== JSON.stringify(result.siteData)) {
        await commitTextFile(SITE_DATA_PATH, nextJson, `Admin: ${summary}`);
        committed.push(SITE_DATA_PATH);
      }
    }

    // 2) Kalendar zauzetosti
    if (result.bookedDates !== undefined) {
      const errMsg = validateBookedDates(result.bookedDates);
      if (errMsg) {
        return NextResponse.json(
          { error: `Gemini je vratio neispravan kalendar (${errMsg}). Ništa nije objavljeno.`, reply: result.reply },
          { status: 502 },
        );
      }
      const nextRaw = serializeBookedDates(result.bookedDates);
      const prevParsed = JSON.parse(bookedRaw) as Record<string, unknown>;
      if (
        JSON.stringify(prevParsed.bookedDates) !== JSON.stringify(result.bookedDates.bookedDates) ||
        JSON.stringify(prevParsed.bookedRanges) !== JSON.stringify(result.bookedDates.bookedRanges)
      ) {
        await commitTextFile(BOOKED_PATH, nextRaw, `Admin kalendar: ${summary}`);
        committed.push(BOOKED_PATH);
      }
    }

    // 3) Izvorni kod — faza 2 se pokreće samo ako Gemini zatraži fajlove
    if (result.codeRequest && result.codeRequest.files.length > 0) {
      const requested = result.codeRequest.files.filter(
        (p) => typeof p === "string" && sourcePaths.includes(p),
      );
      const files = await getRepoFiles(requested);
      const codeResult = await runAdminCodeEdit(provider, {
        message,
        plan: result.codeRequest.plan,
        files,
      });
      result.reply = codeResult.reply;

      for (const edit of codeResult.codeEdits) {
        if (!CODE_EDIT_ALLOW.test(edit.path)) {
          return NextResponse.json(
            {
              error: `Izmjena fajla ${edit.path} nije dozvoljena kroz chat (zaštita od gubitka pristupa). Prethodne izmjene su objavljene.`,
              reply: result.reply,
              committed,
            },
            { status: 422 },
          );
        }
        if (typeof edit.content !== "string" || !edit.content.trim()) {
          return NextResponse.json(
            { error: `Gemini je vratio prazan sadržaj za ${edit.path}.`, reply: result.reply },
            { status: 502 },
          );
        }
        await commitTextFile(
          edit.path,
          edit.content,
          `Admin kod: ${edit.summary?.slice(0, 60) || summary}`,
        );
        committed.push(edit.path);
      }
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `GitHub commit nije uspio: ${msg}`, reply: result.reply, committed },
      { status: 502 },
    );
  }

  const changed = committed.length > 0;
  const codeChanged = committed.some(
    (p) => p !== SITE_DATA_PATH && p !== BOOKED_PATH,
  );
  return NextResponse.json({ ok: true, reply: result.reply, changed, codeChanged, committed });
}
