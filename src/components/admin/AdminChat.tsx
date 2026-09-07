"use client";

import { Camera, ImagePlus, Loader2, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ChatMessage {
  role: "user" | "assistant" | "status";
  text: string;
  /** Lokalni preview URL slike uz user poruku. */
  imagePreview?: string;
  error?: boolean;
}

interface PendingImage {
  /** Originalni fajl (za upload). */
  blob: Blob;
  mimeType: string;
  name: string;
  previewUrl: string;
}

const MAX_DIMENSION = 1600;
const WEBP_QUALITY = 0.82;

/** Smanji i kompresuj sliku u WebP — manji upload, manji Git commit. */
async function compressToWebp(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas nije podržan.");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", WEBP_QUALITY),
  );
  if (!blob) throw new Error("Kompresija slike nije uspjela.");
  return blob;
}

export function AdminChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: 'Zdravo! Ovdje mijenjate sadržaj stranice. Napišite npr. "Promijeni cijenu Paketa 1 na 280 KM" ili priložite sliku uz poruku "Postavi ovo kao hero sliku".',
    },
  ]);
  const [input, setInput] = useState("");
  const [pendingImage, setPendingImage] = useState<PendingImage | null>(null);
  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, phase]);

  useEffect(() => () => {
    if (pendingImage) URL.revokeObjectURL(pendingImage.previewUrl);
  }, [pendingImage]);

  function onPickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    setPendingImage({
      blob: file,
      mimeType: file.type,
      name: file.name || "kamera",
      previewUrl: URL.createObjectURL(file),
    });
  }

  function clearPendingImage() {
    if (pendingImage) URL.revokeObjectURL(pendingImage.previewUrl);
    setPendingImage(null);
  }

  function pushMessage(msg: ChatMessage) {
    setMessages((prev) => [...prev, msg]);
  }

  function replaceStatus(text: string | null) {
    setPhase(text);
  }

  async function onSend() {
    const text = input.trim();
    if (!text || busy) return;

    const image = pendingImage;
    pushMessage({ role: "user", text, imagePreview: image?.previewUrl });
    setInput("");
    setPendingImage(null);
    setBusy(true);

    try {
      let imagePayload:
        | { imagePath: string; imageBase64: string; imageMimeType: string }
        | undefined;

      // Korak 1: upload slike na GitHub
      if (image) {
        replaceStatus("Kompresujem sliku…");
        const webp = await compressToWebp(image.blob as File);

        replaceStatus("Uploadujem sliku na GitHub…");
        const form = new FormData();
        form.append(
          "image",
          new File([webp], image.name.replace(/\.[a-z0-9]+$/i, "") + ".webp", {
            type: "image/webp",
          }),
        );
        const upRes = await fetch("/api/admin/upload", { method: "POST", body: form });
        const upJson = await upRes.json().catch(() => ({}));
        if (!upRes.ok) {
          throw new Error(upJson.error || `Upload nije uspio (${upRes.status}).`);
        }
        imagePayload = {
          imagePath: upJson.path,
          imageBase64: upJson.base64,
          imageMimeType: upJson.mimeType,
        };
      }

      // Korak 2: Gemini obrađuje zahtjev i ažurira site-data.json
      replaceStatus("Gemini ažurira podatke…");
      const chatRes = await fetch("/api/admin/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, ...imagePayload }),
      });
      const chatJson = await chatRes.json().catch(() => ({}));
      if (!chatRes.ok) {
        throw new Error(chatJson.error || `Greška (${chatRes.status}).`);
      }

      replaceStatus(null);
      pushMessage({
        role: "assistant",
        text:
          chatJson.reply +
          (chatJson.changed
            ? "\n\n✅ Objavljeno! Vercel će za minut-dva osvježiti stranicu."
            : ""),
      });
    } catch (err) {
      replaceStatus(null);
      pushMessage({
        role: "assistant",
        error: true,
        text: `⚠️ ${err instanceof Error ? err.message : String(err)}`,
      });
    } finally {
      setBusy(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void onSend();
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Poruke */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                m.role === "user"
                  ? "rounded-br-sm bg-pine-700 text-cream-50"
                  : m.error
                    ? "rounded-bl-sm border border-red-200 bg-red-50 text-red-800"
                    : "rounded-bl-sm border border-pine-100 bg-white text-pine-950"
              }`}
            >
              {m.imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={m.imagePreview}
                  alt="Priložena slika"
                  className="mb-2 max-h-40 rounded-lg object-cover"
                />
              ) : null}
              {m.text}
            </div>
          </div>
        ))}

        {/* Indikator trenutne faze */}
        {phase ? (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border border-pine-100 bg-white px-4 py-2.5 text-sm text-pine-950/70 shadow-sm">
              <Loader2 className="h-4 w-4 animate-spin text-pine-600" />
              {phase}
            </div>
          </div>
        ) : null}
      </div>

      {/* Thumbnail odabrane slike */}
      {pendingImage ? (
        <div className="border-t border-pine-100 bg-cream-100 px-4 py-2">
          <div className="relative inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={pendingImage.previewUrl}
              alt="Odabrana slika"
              className="h-20 w-20 rounded-lg object-cover"
            />
            <button
              type="button"
              onClick={clearPendingImage}
              aria-label="Ukloni sliku"
              className="absolute -right-2 -top-2 rounded-full bg-pine-950 p-1 text-cream-50 shadow"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : null}

      {/* Unos */}
      <div className="border-t border-pine-100 bg-white px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-end gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onPickImage}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={busy}
            aria-label="Dodaj ili slikaj fotografiju"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-pine-200 text-pine-700 transition hover:bg-pine-50 disabled:opacity-50"
          >
            <span className="sr-only">Dodaj sliku</span>
            <ImagePlus className="h-5 w-5" />
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={busy}
            rows={1}
            placeholder="Napišite šta želite promijeniti…"
            className="max-h-32 min-h-11 flex-1 resize-none rounded-2xl border border-pine-200 bg-cream-50 px-4 py-2.5 text-sm text-pine-950 outline-none placeholder:text-pine-950/40 focus:border-pine-400 disabled:opacity-60"
          />
          <button
            type="button"
            onClick={() => void onSend()}
            disabled={busy || !input.trim()}
            aria-label="Pošalji"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold text-pine-950 transition hover:bg-gold-light disabled:opacity-50"
          >
            {busy ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
        <p className="mt-1.5 flex items-center gap-1 px-1 text-[11px] text-pine-950/50">
          <Camera className="h-3 w-3" />
          Na telefonu ikona slike otvara kameru ili galeriju. Slike se spremaju u /uploads.
        </p>
      </div>
    </div>
  );
}
