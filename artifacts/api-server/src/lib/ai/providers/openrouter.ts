import { buildPrompt } from "../prompt";
import { parseProviderResponse } from "../parse";
import { ProviderError } from "../types";
import type { SearchResult } from "../types";

export const name = "openrouter";

const CHAT_URL = "https://openrouter.ai/api/v1/chat/completions";

// google/gemini-flash-1.5-8b supports JSON mode and is available on the free tier.
// Fallback model if the primary is unavailable.
const PRIMARY_MODEL = "google/gemini-flash-1.5-8b";

export function isConfigured(): boolean {
  return Boolean(process.env["OPENROUTER_API_KEY"]);
}

export async function search(query: string, signal: AbortSignal): Promise<SearchResult> {
  const apiKey = process.env["OPENROUTER_API_KEY"]!;

  let response: Response;
  try {
    response = await fetch(CHAT_URL, {
      method: "POST",
      signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://scholartrack.app",
        "X-Title": "ScholarTrack",
      },
      body: JSON.stringify({
        model: PRIMARY_MODEL,
        messages: [{ role: "user", content: buildPrompt(query) }],
        response_format: { type: "json_object" },
        max_tokens: 8192,
      }),
    });
  } catch (err) {
    if ((err as Error).name === "AbortError")
      throw new ProviderError("Request timed out", "TIMEOUT", name, true, err);
    throw new ProviderError((err as Error).message, "SERVER_ERROR", name, true, err);
  }

  if (!response.ok) {
    const body = await safeJson<{ error?: { message?: string } }>(response);
    const msg = body?.error?.message ?? response.statusText;

    if (response.status === 429)
      throw new ProviderError(`Rate limit: ${msg}`, "RATE_LIMIT", name, true);
    if (response.status === 401 || response.status === 403)
      throw new ProviderError(`Auth failed: ${msg}`, "AUTH", name, false);
    throw new ProviderError(`HTTP ${response.status}: ${msg}`, "SERVER_ERROR", name, true);
  }

  const data = await response.json() as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content ?? "";

  return parseProviderResponse(content, name);
}

async function safeJson<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
