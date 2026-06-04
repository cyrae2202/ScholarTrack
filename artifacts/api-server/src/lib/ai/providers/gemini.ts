import { GoogleGenAI } from "@google/genai";
import { buildPrompt } from "../prompt";
import { parseProviderResponse } from "../parse";
import { ProviderError } from "../types";
import type { SearchResult } from "../types";

export const name = "gemini";

export function isConfigured(): boolean {
  return Boolean(process.env["GEMINI_API_KEY"]);
}

export async function search(query: string, signal: AbortSignal): Promise<SearchResult> {
  const apiKey = process.env["GEMINI_API_KEY"]!;
  const genAI = new GoogleGenAI({ apiKey });

  // Promise that rejects as soon as the AbortSignal fires (timeout or external cancel).
  const abortPromise = new Promise<never>((_, reject) => {
    if (signal.aborted) {
      reject(new ProviderError("Request timed out", "TIMEOUT", name, true));
      return;
    }
    signal.addEventListener(
      "abort",
      () => reject(new ProviderError("Request timed out", "TIMEOUT", name, true)),
      { once: true },
    );
  });

  try {
    const response = await Promise.race([
      genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: buildPrompt(query) }] }],
        config: { responseMimeType: "application/json", maxOutputTokens: 8192 },
      }),
      abortPromise,
    ]);

    return parseProviderResponse(response.text ?? "", name);
  } catch (err) {
    if (err instanceof ProviderError) throw err;
    throw classifyError(err, name);
  }
}

function classifyError(err: unknown, provider: string): ProviderError {
  const e = err as { message?: string; status?: number };
  const msg = e.message ?? "Unknown Gemini error";

  if (msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED"))
    return new ProviderError(`Rate limit: ${msg}`, "RATE_LIMIT", provider, true, err);

  if (
    msg.includes("401") ||
    msg.includes("403") ||
    msg.includes("API_KEY") ||
    msg.includes("PERMISSION_DENIED")
  )
    return new ProviderError(`Auth failed: ${msg}`, "AUTH", provider, false, err);

  return new ProviderError(msg, "SERVER_ERROR", provider, true, err);
}
