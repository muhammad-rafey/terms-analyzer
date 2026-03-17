import OpenAI from 'openai';

let _client: OpenAI | null = null;

export function getQwenClient(): OpenAI {
  if (!_client) {
    const apiKey = process.env.QWEN_API_KEY;
    if (!apiKey) throw new Error('QWEN_API_KEY environment variable is required');

    _client = new OpenAI({
      apiKey,
      baseURL:
        process.env.QWEN_BASE_URL ||
        'https://dashscope-us.aliyuncs.com/compatible-mode/v1',
    });
  }
  return _client;
}

export const MODEL = 'qwen3.5-flash';

export const SYSTEM_PROMPT = `You are a legal document analyst specializing in Terms & Conditions, privacy policies, and contracts.
Analyze the provided text and return a JSON object.

You MUST return valid JSON matching EXACTLY this schema:
{
  "summary": "<2-4 sentences, plain English, no jargon>",
  "riskLevel": "<one of: LOW | MEDIUM | HIGH>",
  "riskRationale": "<1-2 sentences explaining why this risk level was assigned>",
  "shenanigans": [
    {
      "clause": "<short label for the tricky clause>",
      "explanation": "<plain-English explanation of why this is problematic or hidden>",
      "severity": "<one of: LOW | MEDIUM | HIGH>"
    }
  ],
  "highlights": [
    "<major point 1 as a complete plain-English sentence>",
    "<major point 2>",
    "..."
  ],
  "legalClarity": {
    "score": <integer 1-10, where 1 = incomprehensible legalese, 10 = crystal clear plain English>,
    "label": "<brief label, e.g. 'Very readable' or 'Dense legalese'>",
    "explanation": "<1-2 sentences on the readability and language complexity>"
  }
}

Rules:
- shenanigans: find ALL hidden costs, auto-renewals, arbitration clauses, data selling, unilateral change rights, liability waivers, cancellation restrictions, etc.
- highlights: list 5-10 of the most important things a user needs to know before agreeing.
- Sort shenanigans by severity: HIGH first, then MEDIUM, then LOW.
- If the text does not appear to be a Terms & Conditions document, still analyze it and note this in the summary.
- Never include markdown, code fences, or any text outside the JSON object.`;
