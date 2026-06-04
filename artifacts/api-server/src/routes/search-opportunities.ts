import { Router } from "express";
import { searchOpportunities } from "../lib/ai/search";
import { ProviderError } from "../lib/ai/types";

const router = Router();

router.post("/search-opportunities", async (req, res) => {
  const { query } = req.body as { query?: unknown };

  if (!query || typeof query !== "string" || query.trim().length === 0) {
    res.status(400).json({ error: "query is required and must be a non-empty string" });
    return;
  }

  try {
    const result = await searchOpportunities(query.trim());
    res.json(result);
  } catch (err) {
    const message = (err as Error).message ?? "Failed to search opportunities. Please try again.";
    req.log.error({ err }, "searchOpportunities failed");

    if (err instanceof ProviderError) {
      if (err.code === "AUTH") {
        res.status(401).json({ error: message });
        return;
      }
      if (err.code === "RATE_LIMIT") {
        res.status(429).json({ error: message });
        return;
      }
    }

    if (message.includes("not configured") || message.includes("No AI providers")) {
      res.status(503).json({ error: message });
      return;
    }

    res.status(500).json({ error: message });
  }
});

export default router;
