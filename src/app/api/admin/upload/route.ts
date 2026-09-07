/**
 * POST /api/admin/upload — prima sliku (multipart/form-data, polje "image"),
 * commituje je u public/uploads/ na GitHub i vraća javnu putanju.
 * Base64 sadržaj se vraća klijentu da ga /api/admin/chat proslijedi Geminiju
 * (izbjegava se ponovno čitanje s GitHuba odmah nakon commita).
 */
import { NextResponse } from "next/server";

import { auth, isAdmin } from "@/auth";
import { commitBase64File } from "@/lib/github";

export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_EXT: Record<string, string> = {
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "image/png": "png",
};

function sanitizeFilename(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/, "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "dj")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return base || "slika";
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Niste prijavljeni." }, { status: 401 });
  }
  if (!isAdmin(session)) {
    return NextResponse.json({ error: "Pristup dozvoljen samo administratoru." }, { status: 403 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Očekivan multipart/form-data." }, { status: 400 });
  }

  const file = form.get("image");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Nedostaje polje 'image'." }, { status: 400 });
  }

  const ext = ALLOWED_EXT[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: `Nepodržan tip slike: ${file.type || "nepoznat"}. Dozvoljeno: webp, jpg, png.` },
      { status: 415 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Slika je veća od 8 MB." }, { status: 413 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const base64 = bytes.toString("base64");
  const filename = `${Date.now()}-${sanitizeFilename(file.name)}.${ext}`;
  const publicPath = `/uploads/${filename}`;

  try {
    await commitBase64File(
      `public/uploads/${filename}`,
      base64,
      `Admin upload: ${publicPath}`,
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `GitHub commit nije uspio: ${msg}` }, { status: 502 });
  }

  return NextResponse.json({ ok: true, path: publicPath, base64, mimeType: file.type });
}
