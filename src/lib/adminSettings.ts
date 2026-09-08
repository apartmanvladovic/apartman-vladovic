/**
 * Admin postavke — data/admin-settings.json u repou (GitHub je izvor istine).
 * Trenutno samo izbor LLM providera za admin chat.
 */
import { getLlmProvider, listProviders } from "@/lib/llm";
import { getRepoFile } from "@/lib/github";

export const ADMIN_SETTINGS_PATH = "data/admin-settings.json";

export interface AdminSettings {
  llmProvider: string;
}

const DEFAULTS: AdminSettings = { llmProvider: "gemini" };

/** Čita postavke iz repoa; pri nedostajućem/neispravnom fajlu — defaulti. */
export async function readAdminSettings(): Promise<AdminSettings> {
  const file = await getRepoFile(ADMIN_SETTINGS_PATH);
  if (!file) return DEFAULTS;
  try {
    const parsed = JSON.parse(file.text) as Partial<AdminSettings>;
    const llmProvider =
      typeof parsed.llmProvider === "string" &&
      listProviders().some((p) => p.id === parsed.llmProvider)
        ? parsed.llmProvider
        : DEFAULTS.llmProvider;
    return { llmProvider };
  } catch {
    return DEFAULTS;
  }
}

/** Aktivni provider iz postavki; baca grešku ako ključ nije konfigurisan. */
export async function getActiveLlmProvider() {
  const settings = await readAdminSettings();
  return getLlmProvider(settings.llmProvider);
}
