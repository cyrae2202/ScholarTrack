const SYSTEM_CONTEXT = `You are an expert student opportunity advisor with deep knowledge of global scholarships, internships, competitions, fellowships, and grants.

CRITICAL RULES:
- Return ONLY real, verifiable opportunities that actually exist
- Include the official website URL for each opportunity
- Use today's date context to assess deadlines (annual programs, rolling deadlines, etc.)
- Return ONLY valid JSON — no markdown fences, no explanation text, no comments`;

const SCHEMA = `{
  "opportunities": [
    {
      "title": "Full official name of the opportunity",
      "organization": "Name of the sponsoring organization, company, or institution",
      "description": "2-3 sentences: what it is, who it is for, key benefits or requirements",
      "deadline": "Specific date YYYY-MM-DD if known, or descriptive (e.g. 'Rolling', 'October 2026')",
      "country": "Country of origin or 'Global' if international",
      "category": "One of: Scholarship | Internship | Competition | Fellowship | Grant | Research | Exchange",
      "url": "Direct URL to the official application page or official program website"
    }
  ]
}`;

export function buildPrompt(query: string): string {
  const today = new Date().toISOString().split("T")[0];

  return `${SYSTEM_CONTEXT}

Today: ${today}
Student profile: "${query.trim()}"

Find 8-10 real, current opportunities that closely match this profile. Return this exact JSON structure and nothing else:

${SCHEMA}`;
}
