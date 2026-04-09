import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongodb';
import { Analysis } from '@/models/Analysis';
import { getQwenClient, MODEL, SYSTEM_PROMPT } from '@/lib/qwen';
import {
  sanitizeUserText,
  buildUserMessage,
  generateNonce,
  assertNoLeakage,
} from '@/lib/sanitize';
import type { AnalysisResponse, HistoryItem } from '@/types/analysis';

// Vercel: opt into the Hobby plan's 60s max function duration.
// Without this, the default is 10s, which will cut off long Qwen calls.
export const runtime = 'nodejs';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

// ── Zod schema for Qwen response validation ───────────────────────────────────

const RiskLevelSchema = z.enum(['LOW', 'MEDIUM', 'HIGH']);

const ShenanigansSchema = z.object({
  clause: z.string(),
  explanation: z.string(),
  severity: RiskLevelSchema,
});

const AnalysisResultSchema = z.object({
  summary: z.string(),
  riskLevel: RiskLevelSchema,
  riskRationale: z.string(),
  shenanigans: z.array(ShenanigansSchema).default([]),
  highlights: z.array(z.string()).default([]),
  legalClarity: z.object({
    score: z.number().int().min(1).max(10),
    label: z.string(),
    explanation: z.string(),
  }),
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function hashText(text: string): string {
  return crypto.createHash('sha256').update(text.trim().toLowerCase()).digest('hex');
}

// ── POST /api/analyze ─────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text: string = body?.text ?? '';

    if (!text || text.trim().length < 50) {
      return NextResponse.json(
        { success: false, error: 'Please provide at least 50 characters of text to analyze.' },
        { status: 400 }
      );
    }

    if (text.length > 100_000) {
      return NextResponse.json(
        { success: false, error: 'Text is too long. Please limit to 100,000 characters.' },
        { status: 400 }
      );
    }

    // Sanitize untrusted user input before it touches the LLM prompt.
    const { sanitized } = sanitizeUserText(text);
    if (sanitized.trim().length < 50) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please provide at least 50 characters of readable text to analyze.',
        },
        { status: 400 }
      );
    }
    const nonce = generateNonce();

    const db = await connectToDatabase();

    const inputHash = hashText(sanitized);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    if (db) {
      const cached = await Analysis.findOne({
        inputHash,
        createdAt: { $gte: sevenDaysAgo },
      }).sort({ createdAt: -1 });

      if (cached) {
        const data: AnalysisResponse = {
          _id: cached._id.toString(),
          summary: cached.summary,
          riskLevel: cached.riskLevel,
          riskRationale: cached.riskRationale,
          shenanigans: cached.shenanigans,
          highlights: cached.highlights,
          legalClarity: cached.legalClarity,
          modelUsed: cached.modelUsed,
          tokensUsed: cached.tokensUsed,
          estimatedCostUsd: cached.estimatedCostUsd,
          processingTimeMs: cached.processingTimeMs,
          createdAt: cached.createdAt.toISOString(),
        };
        return NextResponse.json({ success: true, data, cached: true });
      }
    }

    // ── Call Qwen ─────────────────────────────────────────────────────────────

    const start = Date.now();

    const completion = await getQwenClient().chat.completions.create(
      {
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: buildUserMessage(sanitized, nonce),
          },
        ],
        temperature: 0.2,
        max_tokens: 4096,
        response_format: { type: 'json_object' },
        // @ts-expect-error — Qwen-specific, not in OpenAI types
        extra_body: { enable_thinking: false },
      },
      { timeout: 55000 }
    );

    const processingTimeMs = Date.now() - start;
    const inputTokens = completion.usage?.prompt_tokens ?? 0;
    const outputTokens = completion.usage?.completion_tokens ?? 0;
    const tokensUsed = inputTokens + outputTokens;

    // Qwen3.5-Flash: $0.10/1M input, $0.40/1M output
    const estimatedCostUsd =
      (inputTokens / 1_000_000) * 0.10 + (outputTokens / 1_000_000) * 0.40;

    const raw = completion.choices[0]?.message?.content ?? '{}';

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { success: false, error: 'AI returned an unexpected response. Please try again.' },
        { status: 500 }
      );
    }

    const validated = AnalysisResultSchema.safeParse(parsed);
    if (!validated.success) {
      console.error('[analyze] Zod validation failed:', validated.error.issues);
      return NextResponse.json(
        { success: false, error: 'AI response was missing required fields. Please try again.' },
        { status: 500 }
      );
    }

    const result = validated.data;

    // Deterministic safety check after Zod: catch prompt leakage, tag echo,
    // or absurdly-long outputs that indicate an injection succeeded.
    const leakageCheck = assertNoLeakage(result, nonce);
    if (!leakageCheck.ok) {
      console.error('[analyze] leakage check failed:', leakageCheck.reason);
      return NextResponse.json(
        { success: false, error: 'AI response failed safety checks. Please try again.' },
        { status: 500 }
      );
    }

    // Persist to MongoDB only when configured; otherwise return the fresh
    // analysis directly so the app still works in a zero-setup deploy.
    if (db) {
      const analysis = await Analysis.create({
        inputHash,
        rawText: sanitized,
        summary: result.summary,
        riskLevel: result.riskLevel,
        riskRationale: result.riskRationale,
        shenanigans: result.shenanigans,
        highlights: result.highlights,
        legalClarity: result.legalClarity,
        modelUsed: MODEL,
        tokensUsed,
        estimatedCostUsd,
        processingTimeMs,
      });

      const data: AnalysisResponse = {
        _id: analysis._id.toString(),
        summary: analysis.summary,
        riskLevel: analysis.riskLevel,
        riskRationale: analysis.riskRationale,
        shenanigans: analysis.shenanigans,
        highlights: analysis.highlights,
        legalClarity: analysis.legalClarity,
        modelUsed: analysis.modelUsed,
        tokensUsed: analysis.tokensUsed,
        estimatedCostUsd: analysis.estimatedCostUsd,
        processingTimeMs: analysis.processingTimeMs,
        createdAt: analysis.createdAt.toISOString(),
      };

      return NextResponse.json({ success: true, data, cached: false });
    }

    const data: AnalysisResponse = {
      summary: result.summary,
      riskLevel: result.riskLevel,
      riskRationale: result.riskRationale,
      shenanigans: result.shenanigans,
      highlights: result.highlights,
      legalClarity: result.legalClarity,
      modelUsed: MODEL,
      tokensUsed,
      estimatedCostUsd,
      processingTimeMs,
    };

    return NextResponse.json({ success: true, data, cached: false });
  } catch (err) {
    console.error('[analyze] error:', err);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

// ── GET /api/analyze — history ────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const db = await connectToDatabase();

    const id = req.nextUrl.searchParams.get('id');

    // Without a DB there is no history to return and nothing to look up by id.
    if (!db) {
      if (id) {
        return NextResponse.json({ success: false, error: 'Analysis not found.' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: [] });
    }

    if (id) {
      const analysis = await Analysis.findById(id);
      if (!analysis) {
        return NextResponse.json({ success: false, error: 'Analysis not found.' }, { status: 404 });
      }
      const data: AnalysisResponse = {
        _id: analysis._id.toString(),
        summary: analysis.summary,
        riskLevel: analysis.riskLevel,
        riskRationale: analysis.riskRationale,
        shenanigans: analysis.shenanigans,
        highlights: analysis.highlights,
        legalClarity: analysis.legalClarity,
        modelUsed: analysis.modelUsed,
        tokensUsed: analysis.tokensUsed,
        estimatedCostUsd: analysis.estimatedCostUsd,
        processingTimeMs: analysis.processingTimeMs,
        createdAt: analysis.createdAt.toISOString(),
      };
      return NextResponse.json({ success: true, data });
    }

    const analyses = await Analysis.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .select('summary riskLevel rawText createdAt');

    const data: HistoryItem[] = analyses.map((a) => ({
      _id: a._id.toString(),
      preview: a.rawText.slice(0, 100),
      riskLevel: a.riskLevel,
      createdAt: a.createdAt.toISOString(),
      summary: a.summary,
    }));

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('[analyze/history] error:', err);
    return NextResponse.json({ success: false, error: 'Failed to load history.' }, { status: 500 });
  }
}
