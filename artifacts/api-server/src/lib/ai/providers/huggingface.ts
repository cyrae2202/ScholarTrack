import { buildPrompt } from "../prompt";
import { parseProviderResponse } from "../parse";
import { ProviderError } from "../types";
import type { SearchResult } from "../types";

export const name = "huggingface";

// HuggingFace Inference API — OpenAI-compatible chat completions endpoint.
// Mistral-7B-Instruct is widely available on the free tier and handles
// JSON generation reliably when instructed via prompt.
const CHAT_URL = "https://api-inference.huggingface.co/v1/chat/completions";
const MODEL = "mistralai/Mistral-7B-Instruct-v0.3";

export function isConfigured(): boolean {
  return Boolean(process.env["HUGGINGFACE_API_KEY"]);
}

export async function search(query: string, signal: AbortSignal): Promise<SearchResult> {
  const apiKey = process.env["HUGGINGFACE_API_KEY"]!;

  let response: Response;
  try {
    response = await fetch(CHAT_URL, {
      method: "POST",
      signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: buildPrompt(query) }],
        max_tokens: 4096,
        stream: false,
      }),
    });
  } catch (err) {
    if ((err as Error).name === "AbortError")
      throw new ProviderError("Request timed out", "TIMEOUT", name, true, err);
    throw new ProviderError((err as Error).message, "SERVER_ERROR", name, true, err);
  }

  if (!response.ok) {
    const body = await safeJson<{ error?: string }>(response);
    const msg = body?.error ?? response.statusText;

    // HuggingFace returns 503 when the model is still loading — retryable.
    if (response.status === 503)
      throw new ProviderError(`Model loading: ${msg}`, "SERVER_ERROR", name, true);
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
