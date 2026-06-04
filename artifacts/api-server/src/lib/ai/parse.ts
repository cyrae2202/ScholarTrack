import { z } from "zod";
import { ProviderError } from "./types";
import type { SearchResult } from "./types";

const OpportunitySchema = z.object({
  title: z.string().min(1),
  organization: z.string().min(1),
  description: z.string().min(1),
  deadline: z.string().min(1),
  country: z.string().min(1),
  category: z.string().min(1),
  url: z.string().min(1),
});

const SearchResultSchema = z.object({
  opportunities: z.array(OpportunitySchema).min(1),
});

/**
 * Attempts to strip markdown code fences (```json ... ```) before parsing.
 */
function extractJsonText(raw: string): string {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]+?)\s*```/);
  if (fenced?.[1]) return fenced[1].trim();
  return raw.trim();
}

export function parseProviderResponse(raw: string, provider: string): SearchResult {
  if (!raw || raw.trim() === "") {
    throw new ProviderError("Empty response from provider", "INVALID_RESPONSE", provider, false);
  }

  const jsonText = extractJsonText(raw);

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new ProviderError(
      `Provider returned non-JSON text (preview: ${jsonText.slice(0, 120)})`,
      "INVALID_RESPONSE",
      provider,
      false,
    );
  }

  const result = SearchResultSchema.safeParse(parsed);
  if (!result.success) {
    throw new ProviderError(
      `Response schema validation failed: ${result.error.errors.map(e => e.message).join("; ")}`,
      "INVALID_RESPONSE",
      provider,
      false,
    );
  }

  return result.data;
}
