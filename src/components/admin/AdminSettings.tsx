"use client";

/**
 * Postavke admin chata — izbor LLM providera. Vrijednost se čuva u
 * data/admin-settings.json (GitHub repo); ključevi su env varijable.
 */
import { Loader2, Settings2 } from "lucide-react";
import { useEffect, useState } from "react";

interface ProviderInfo {
  id: string;
  label: string;
  configured: boolean;
  supportsImages: boolean;
}

export function AdminSettings() {
  const [providers, setProviders] = useState<ProviderInfo[]>([]);
  const [current, setCurrent] = useState<string>("");
  const [selected, setSelected] = useState<string>("");
  const [busy, setBusy] = useState<"load" | "save" | null>("load");
  const [notice, setNotice] = useState<{ text: string; error?: boolean } | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/admin/settings", { cache: "no-store" });
        const json = (await res.json()) as {
          current?: string;
          providers?: ProviderInfo[];
          error?: string;
        };
        if (!res.ok) throw new Error(json.error || `Greška (${res.status}).`);
        setProviders(json.providers ?? []);
        setCurrent(json.current ?? "");
        setSelected(json.current ?? "");
      } catch (err) {
        setNotice({ text: err instanceof Error ? err.message : String(err), error: true });
      } finally {
        setBusy(null);
      }
    })();
  }, []);

  async function save() {
    setBusy("save");
    setNotice(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: selected }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error || `Greška (${res.status}).`);
      setCurrent(selected);
      setNotice({ text: "Sačuvano. Admin chat odmah koristi novi provider." });
    } catch (err) {
      setNotice({ text: err instanceof Error ? err.message : String(err), error: true });
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4">
      <div className="mx-auto w-full max-w-md">
        <p className="mb-3 flex items-center gap-2 text-sm text-pine-950/70">
          <Settings2 className="h-4 w-4 text-pine-600" />
          Model koji admin chat koristi za izmjene.
        </p>

        <div className="rounded-2xl border border-pine-100 bg-white p-4 shadow-sm">
          {busy === "load" ? (
            <p className="flex items-center gap-2 text-xs text-pine-950/60">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Učitavam postavke…
            </p>
          ) : (
            <div className="space-y-2">
              {providers.map((p) => (
                <label
                  key={p.id}
                  className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${
                    selected === p.id
                      ? "border-pine-400 bg-pine-50"
                      : "border-pine-100 bg-white"
                  } ${p.configured ? "" : "opacity-50"}`}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="llm-provider"
                      value={p.id}
                      checked={selected === p.id}
                      disabled={!p.configured || busy !== null}
                      onChange={() => setSelected(p.id)}
                      className="h-4 w-4 accent-pine-700"
                    />
                    <span className="font-semibold text-pine-900">{p.label}</span>
                  </span>
                  <span className="text-[11px] text-pine-950/50">
                    {p.configured
                      ? p.supportsImages
                        ? "slike ✓"
                        : "bez slika"
                      : "nema API ključ"}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => void save()}
          disabled={busy !== null || !selected || selected === current}
          className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-pine-700 text-sm font-semibold text-cream-50 transition hover:bg-pine-600 disabled:opacity-50"
        >
          {busy === "save" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Sačuvaj postavke
        </button>

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

        <p className="mt-4 text-[11px] leading-relaxed text-pine-950/50">
          Novi provideri se dodaju kroz kod (src/lib/llm/) plus odgovarajuća env
          varijabla sa API ključem na Vercelu — nakon toga se pojavljuju ovdje.
        </p>
      </div>
    </div>
  );
}
