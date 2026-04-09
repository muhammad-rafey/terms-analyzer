# Terms Analyzer

AI-powered Terms & Conditions analyzer. Paste any legal agreement and instantly get:

- **Risk Level** — LOW / MEDIUM / HIGH assessment with explanation
- **Plain-English Summary** — 2–4 sentences, no jargon
- **Hidden Costs & Shenanigans** — auto-renewals, arbitration clauses, data selling, liability waivers, and more
- **Key Highlights** — the 5–10 things you actually need to know
- **Legal Clarity Score** — how readable the document is (1–10)

Built with Next.js 16, MongoDB (caching), Qwen3.5-Flash, and Tailwind CSS. Includes dark mode and SEO.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router, TypeScript) |
| AI | Qwen3.5-Flash (via OpenAI-compatible SDK) |
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
# Required
QWEN_API_KEY=...              # https://dashscope.console.aliyun.com/

# Optional
QWEN_BASE_URL=https://dashscope-us.aliyuncs.com/compatible-mode/v1
MONGODB_URI=mongodb+srv://... # Optional — enables caching + history. Atlas or local: mongodb://localhost:27017/terms-analyzer
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # Optional on Vercel (auto-detected); set for custom domains
```

Only `QWEN_API_KEY` is required. Without `MONGODB_URI` the app runs in stateless mode — every request calls Qwen and there is no history panel.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy to Vercel (free tier)

This app is configured to run on the **Vercel Hobby plan** out of the box:

1. Push the repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Set the environment variables in the Vercel dashboard:
   - `QWEN_API_KEY` — **required**
   - `MONGODB_URI` — optional (omit for a zero-setup deploy)
   - `NEXT_PUBLIC_SITE_URL` — optional (only needed for a custom domain)
4. Click **Deploy**.

**How it fits the Hobby plan:** Vercel Hobby functions default to a 10-second timeout, which is not enough for a Qwen call. The `POST /api/analyze` route opts into the 60-second maximum via `export const maxDuration = 60`, and the Qwen SDK uses a 55-second client-side timeout so errors surface cleanly inside the function budget.

**MongoDB is optional.** If you leave `MONGODB_URI` unset, the analyzer still works — it just skips caching and the recent-analyses history. To enable both, create a free MongoDB Atlas M0 cluster and paste its connection string into the Vercel env var.

**Site URL is auto-detected.** On Vercel, `getSiteUrl()` (see `src/lib/site.ts`) picks up `VERCEL_PROJECT_PRODUCTION_URL` / `VERCEL_URL` automatically, so canonical URLs, Open Graph tags, `robots.txt`, and `sitemap.xml` all point at your deployment without any extra config. Override with `NEXT_PUBLIC_SITE_URL` only when using a custom domain.

---

## Project Structure

```
src/
├── app/
│   ├── api/analyze/route.ts   # POST: analyze  |  GET: history / single lookup
│   ├── globals.css
│   ├── layout.tsx             # SEO metadata, JSON-LD, fonts, theme script
│   ├── not-found.tsx          # Custom 404 page
│   ├── page.tsx               # Single-page app
│   ├── robots.ts              # robots.txt generation
│   └── sitemap.ts             # sitemap.xml generation
├── components/
│   ├── Header.tsx             # Logo + dark mode toggle
│   ├── InputPanel.tsx         # Textarea + submit
│   ├── ResultsPanel.tsx       # Composes all result cards
│   ├── SummaryCard.tsx
│   ├── ShenanigansCard.tsx
│   ├── HighlightsCard.tsx
│   ├── ClarityCard.tsx
│   ├── HistoryPanel.tsx       # Recent analyses
│   └── LoadingOverlay.tsx
├── contexts/
│   └── ThemeContext.tsx       # Dark mode
├── lib/
│   ├── mongodb.ts             # Mongoose singleton
│   └── qwen.ts               # Qwen client + system prompt
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

### `GET /api/analyze?id=<id>`

Returns the full analysis document by ID.

---

## Caching

Identical inputs (by SHA-256 hash) return cached results for up to 7 days, avoiding redundant API calls. MongoDB documents are auto-deleted after 30 days via TTL index.

---

## SEO

The app ships with a full SEO setup out of the box. All SEO metadata is driven by the `NEXT_PUBLIC_SITE_URL` environment variable -- set it to your production domain before deploying.

### What's included

| Feature | Implementation |
|---------|---------------|
| Title & description | Keyword-rich defaults via Next.js `Metadata` API (`layout.tsx`) |
| Open Graph tags | `og:type`, `og:locale`, `og:url`, `og:siteName`, `og:title`, `og:description` |
| Twitter Cards | `summary_large_image` card with title and description |
| Canonical URL | Auto-generated from `metadataBase` + `alternates.canonical` |
| `robots.txt` | Dynamic via `robots.ts` -- allows `/`, disallows `/api/` |
| `sitemap.xml` | Dynamic via `sitemap.ts` -- home page with weekly change frequency |
| JSON-LD | `WebApplication` schema with feature list and free pricing |
| Heading hierarchy | Proper `h1` > `h2` structure across all pages |
| Semantic HTML | `section`, `article`, `nav`, `main`, `header`, `footer` landmarks |
| Accessibility | `aria-live` for dynamic results, `aria-label` on controls, `role="alert"` on errors, screen-reader-only labels, skip-to-content link |
| Security headers | `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` |
| Custom 404 | `not-found.tsx` with `noindex` meta and link back to home |
| Googlebot directives | `max-image-preview: large`, `max-snippet: -1`, `max-video-preview: -1` |

### Configuring for production

On Vercel, no config is needed — the site URL is auto-detected from `VERCEL_PROJECT_PRODUCTION_URL`. For a custom domain, set:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

This single variable controls canonical URLs, Open Graph URLs, `sitemap.xml` entries, and `robots.txt` sitemap references. Detection order is defined in `src/lib/site.ts`: `NEXT_PUBLIC_SITE_URL` → `VERCEL_PROJECT_PRODUCTION_URL` → `VERCEL_URL` → `http://localhost:3000`.

---

## Disclaimer

This tool is for **informational purposes only** and does not constitute legal advice. Always consult a qualified attorney for legal matters.
