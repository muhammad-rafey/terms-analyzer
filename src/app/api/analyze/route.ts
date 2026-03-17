import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectToDatabase } from '@/lib/mongodb';
import { Analysis } from '@/models/Analysis';
import { getOpenAIClient, SYSTEM_PROMPT } from '@/lib/openai';
import type { AnalysisResult, AnalysisResponse, HistoryItem } from '@/types/analysis';

function hashText(text: string): string {
  return crypto
    .createHash('sha256')
    .update(text.trim().toLowerCase())
    .digest('hex');
}

function isValidAnalysisResult(obj: unknown): obj is AnalysisResult {
  if (!obj || typeof obj !== 'object') return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o.summary === 'string' &&
    ['LOW', 'MEDIUM', 'HIGH'].includes(o.riskLevel as string) &&
    typeof o.riskRationale === 'string' &&
    Array.isArray(o.shenanigans) &&
    Array.isArray(o.highlights) &&
    typeof o.legalClarity === 'object'
  );
}

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

    await connectToDatabase();

    const inputHash = hashText(text);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

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
        processingTimeMs: cached.processingTimeMs,
        createdAt: cached.createdAt.toISOString(),
      };
      return NextResponse.json({ success: true, data, cached: true });
    }

    const start = Date.now();

    const completion = await getOpenAIClient().chat.completions.create({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Analyze the following Terms & Conditions text:\n\n---\n${text}\n---`,
        },
      ],
      temperature: 0.2,
      max_tokens: 2000,
    });

    const processingTimeMs = Date.now() - start;
    const tokensUsed = completion.usage?.total_tokens ?? 0;
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

    if (!isValidAnalysisResult(parsed)) {
      return NextResponse.json(
        { success: false, error: 'AI response was missing required fields. Please try again.' },
        { status: 500 }
      );
    }

    const analysis = await Analysis.create({
      inputHash,
      rawText: text,
      summary: parsed.summary,
      riskLevel: parsed.riskLevel,
      riskRationale: parsed.riskRationale,
      shenanigans: parsed.shenanigans,
      highlights: parsed.highlights,
      legalClarity: parsed.legalClarity,
      modelUsed: 'gpt-4o',
      tokensUsed,
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
      processingTimeMs: analysis.processingTimeMs,
      createdAt: analysis.createdAt.toISOString(),
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

export async function GET() {
  try {
    await connectToDatabase();

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
    return NextResponse.json(
      { success: false, error: 'Failed to load history.' },
      { status: 500 }
    );
  }
}
