import { logger } from "../logger";
import * as gemini from "./providers/gemini";
import * as openrouter from "./providers/openrouter";
import * as huggingface from "./providers/huggingface";
import { ProviderError } from "./types";
import type { SearchResult } from "./types";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const PROVIDERS = [gemini, openrouter, huggingface] as const;

/** Maximum total wait time per provider attempt. */
const TIMEOUT_MS = 30_000;

/** Number of retries per provider (total attempts = MAX_RETRIES + 1). */
const MAX_RETRIES = 2;

/** Base delay for non-rate-limit retries. */
const BASE_RETRY_DELAY_MS = 500;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Provider = (typeof PROVIDERS)[number];

interface ProviderFailure {
  provider: string;
  code: string;
  message: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isRetryable(err: unknown): boolean {
  if (err instanceof ProviderError) {
    // AUTH and INVALID_RESPONSE are definitive failures — no point retrying.
    return err.retryable && err.code !== "AUTH" && err.code !== "INVALID_RESPONSE";
  }
  return true;
}

function retryDelay(err: unknown, attempt: number): number {
  if (err instanceof ProviderError && err.code === "RATE_LIMIT") {
    // Exponential back-off for rate limits: 1 s, 2 s, 4 s …
    return Math.pow(2, attempt) * 1_000;
  }
  // Linear back-off for transient / server errors: 500 ms, 1 s, 1.5 s …
  return BASE_RETRY_DELAY_MS * (attempt + 1);
}

// ---------------------------------------------------------------------------
// Per-provider attempt with timeout + retry
// ---------------------------------------------------------------------------

async function runProvider(provider: Provider, query: string): Promise<SearchResult> {
  let lastErr: unknown = new Error("Unexpected: no attempts made");

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      const delay = retryDelay(lastErr, attempt - 1);
      logger.warn(
        { provider: provider.name, attempt, delay_ms: delay },
        "Retrying provider after delay",
      );
      await sleep(delay);
    }

    // Each attempt gets its own timeout-backed AbortController.
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const start = Date.now();
    try {
      logger.info(
        { provider: provider.name, attempt, query_length: query.length },
        "Calling AI provider",
      );

      const result = await provider.search(query, controller.signal);

      logger.info(
        {
          provider: provider.name,
          attempt,
          duration_ms: Date.now() - start,
          opportunity_count: result.opportunities.length,
        },
        "Provider succeeded",
      );

      return result;
    } catch (err) {
      lastErr = err;

      const pe = err instanceof ProviderError ? err : null;
      logger.warn(
        {
          provider: provider.name,
          attempt,
          duration_ms: Date.now() - start,
          error_code: pe?.code ?? "UNKNOWN",
          error_message: (err as Error).message,
          retryable: isRetryable(err),
        },
        "Provider attempt failed",
      );

      if (!isRetryable(err)) {
        // Non-retryable: bail out of the retry loop immediately.
        throw err;
      }

      if (attempt === MAX_RETRIES) {
        // Exhausted retries for this provider.
        throw err;
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  throw lastErr;
}

// ---------------------------------------------------------------------------
// Public API — the only export the rest of the app should import
// ---------------------------------------------------------------------------

/**
 * Searches for student opportunities using a waterfall of AI providers.
 *
 * Priority: Gemini → OpenRouter → HuggingFace
 *
 * Each provider is tried up to (MAX_RETRIES + 1) times before falling through
 * to the next one. Providers whose API keys are missing are skipped silently.
 */
export async function searchOpportunities(query: string): Promise<SearchResult> {
  const failures: ProviderFailure[] = [];

  for (const provider of PROVIDERS) {
    if (!provider.isConfigured()) {
      logger.info({ provider: provider.name }, "Provider not configured — skipping");
      continue;
    }

    try {
      return await runProvider(provider, query);
    } catch (err) {
      const pe = err instanceof ProviderError ? err : null;
      const failure: ProviderFailure = {
        provider: provider.name,
        code: pe?.code ?? "UNKNOWN",
        message: (err as Error).message,
      };
      failures.push(failure);

      logger.error(
        { ...failure },
        "Provider exhausted — falling back to next provider",
      );
    }
  }

  // All providers have been tried and failed.
  if (failures.length === 0) {
    throw new Error(
      "No AI providers are configured. " +
        "Set at least one of: GEMINI_API_KEY, OPENROUTER_API_KEY, HUGGINGFACE_API_KEY.",
    );
  }

  const summary = failures.map(f => `${f.provider}(${f.code})`).join(" → ");
  logger.error({ failures }, "All AI providers exhausted");

  throw new Error(
    `All AI providers failed — ${summary}. Please try again in a moment.`,
  );
}
