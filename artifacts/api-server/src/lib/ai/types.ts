export interface DiscoveredOpportunity {
  title: string;
  organization: string;
  description: string;
  deadline: string;
  country: string;
  category: string;
  url: string;
}

export interface SearchResult {
  opportunities: DiscoveredOpportunity[];
}

export type ProviderErrorCode =
  | "NOT_CONFIGURED"    // API key missing — provider skipped
  | "TIMEOUT"           // Request exceeded time limit — retryable
  | "RATE_LIMIT"        // HTTP 429 — retryable with backoff
  | "AUTH"              // HTTP 401/403 — not retryable; skip provider
  | "INVALID_RESPONSE"  // Parse / schema failure — not retryable
  | "SERVER_ERROR"      // HTTP 5xx — retryable
  | "UNKNOWN";          // Catch-all — retryable

export class ProviderError extends Error {
  readonly name = "ProviderError";

  constructor(
    message: string,
    public readonly code: ProviderErrorCode,
    public readonly provider: string,
    public readonly retryable: boolean,
    public readonly cause?: unknown,
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
