# Terms Analyzer

AI-powered Terms & Conditions analyzer. Paste any legal agreement and instantly get:

- **Risk Level** — LOW / MEDIUM / HIGH assessment with explanation
- **Plain-English Summary** — 2–4 sentences, no jargon
- **Hidden Costs & Shenanigans** — auto-renewals, arbitration clauses, data selling, liability waivers, and more
- **Key Highlights** — the 5–10 things you actually need to know
- **Legal Clarity Score** — how readable the document is (1–10)

Built with Next.js 15, MongoDB (caching), OpenAI GPT-4o, and Tailwind CSS. Includes dark mode.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router, TypeScript) |
| AI | OpenAI GPT-4o |
| Database | MongoDB + Mongoose |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |

---

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url>
cd terms-analyzer
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```bash
OPENAI_API_KEY=sk-...         # https://platform.openai.com/api-keys
MONGODB_URI=mongodb+srv://... # Atlas or local: mongodb://localhost:27017/terms-analyzer
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
src/
├── app/
│   ├── api/analyze/route.ts   # POST: analyze T&C  |  GET: history
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx               # Single-page app
├── components/
│   ├── Header.tsx             # Logo + dark mode toggle
│   ├── InputPanel.tsx         # Textarea + submit
│   ├── ResultsPanel.tsx       # Composes all result cards
│   ├── SummaryCard.tsx
│   ├── RiskBadge.tsx
│   ├── ShenanigansCard.tsx
│   ├── HighlightsCard.tsx
│   ├── ClarityCard.tsx
│   ├── HistoryPanel.tsx       # Recent analyses
│   └── LoadingOverlay.tsx
├── contexts/
│   └── ThemeContext.tsx       # Dark mode
├── lib/
│   ├── mongodb.ts             # Mongoose singleton
│   └── openai.ts             # OpenAI client + system prompt
├── models/
│   └── Analysis.ts           # Mongoose schema
└── types/
    └── analysis.ts           # Shared TypeScript interfaces
```

---

## API

### `POST /api/analyze`

Analyze a Terms & Conditions document.

**Request:**
```json
{ "text": "raw T&C text..." }
```

**Response:**
```json
{
  "success": true,
  "cached": false,
  "data": {
    "summary": "...",
    "riskLevel": "HIGH",
    "riskRationale": "...",
    "shenanigans": [{ "clause": "...", "explanation": "...", "severity": "HIGH" }],
    "highlights": ["..."],
    "legalClarity": { "score": 4, "label": "Dense legalese", "explanation": "..." }
  }
}
```

### `GET /api/analyze`

Returns the 10 most recent analyses (preview only).

---

## Caching

Identical inputs (by SHA-256 hash) return cached results for up to 7 days, avoiding redundant API calls. MongoDB documents are auto-deleted after 30 days via TTL index.

---

## Disclaimer

This tool is for **informational purposes only** and does not constitute legal advice. Always consult a qualified attorney for legal matters.
