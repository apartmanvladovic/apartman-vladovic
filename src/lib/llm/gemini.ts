/**
 * Gemini provider (Google AI Studio, @google/genai) — default za admin chat.
 */
import { GoogleGenAI, type Schema } from "@google/genai";

import type { LlmGenerateParams, LlmProvider } from "@/lib/llm";

const MODEL = "gemini-2.5-flash";

export const geminiProvider: LlmProvider = {
  id: "gemini",
  label: "Google Gemini 2.5 Flash",
  envKey: "GEMINI_API_KEY",
  supportsImages: true,
  async generate<T>(params: LlmGenerateParams): Promise<T> {
    const { systemInstruction, schema, parts } = params;
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [{ role: "user", parts }],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema as Schema,
        temperature: 0.2,
      },
    });
    const text = response.text;
    if (!text) throw new Error("Gemini nije vratio odgovor.");
    return JSON.parse(text) as T;
  },
};
