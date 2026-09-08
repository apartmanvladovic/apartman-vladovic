/**
 * LLM provider registry — admin chat ne zna za konkretan model.
 * Aktivni provider bira se u /admin (Postavke) i čuva u
 * data/admin-settings.json; API ključevi su env varijable po provideru.
 *
 * Dodavanje novog providera: implementirati LlmProvider u
 * src/lib/llm/<ime>.ts i registrirati ga u PROVIDERS ispod.
 */

export type LlmPart =
  | { text: string }
  | { inlineData: { mimeType: string; data: string } };

export interface LlmGenerateParams {
  systemInstruction: string;
  /** JSON schema odgovora (provider ga mapira na svoj format). */
  schema: unknown;
  parts: LlmPart[];
}

export interface LlmProvider {
  id: string;
  label: string;
  /** Env varijabla sa API ključem. */
  envKey: string;
  supportsImages: boolean;
  generate<T>(params: LlmGenerateParams): Promise<T>;
}

export interface LlmProviderInfo {
  id: string;
  label: string;
  /** API ključ je postavljen u env varijablama. */
  configured: boolean;
  supportsImages: boolean;
}

import { geminiProvider } from "@/lib/llm/gemini";

const PROVIDERS: Record<string, LlmProvider> = {
  [geminiProvider.id]: geminiProvider,
};

export function listProviders(): LlmProviderInfo[] {
  return Object.values(PROVIDERS).map((p) => ({
    id: p.id,
    label: p.label,
    configured: !!process.env[p.envKey],
    supportsImages: p.supportsImages,
  }));
}

/** Vraća providera po id-u; baca grešku za nepoznat ili nekonfigurisan. */
export function getLlmProvider(id: string): LlmProvider {
  const provider = PROVIDERS[id];
  if (!provider) {
    throw new Error(
      `Nepoznat LLM provider "${id}". Dostupni: ${Object.keys(PROVIDERS).join(", ")}`,
    );
  }
  if (!process.env[provider.envKey]) {
    throw new Error(`Nedostaje env varijabla: ${provider.envKey}`);
  }
  return provider;
}
