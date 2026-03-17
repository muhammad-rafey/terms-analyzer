'use client';

import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import InputPanel from '@/components/InputPanel';
import ResultsPanel from '@/components/ResultsPanel';
import LoadingOverlay from '@/components/LoadingOverlay';
import HistoryPanel from '@/components/HistoryPanel';
import type { AnalysisResponse, HistoryItem } from '@/types/analysis';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [cached, setCached] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    fetch('/api/analyze')
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setHistory(json.data);
      })
      .catch(() => {});
  }, []);

  async function handleAnalyze(text: string) {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const json = await res.json();

      if (!json.success) {
        setError(json.error ?? 'Something went wrong. Please try again.');
        return;
      }

      setAnalysis(json.data);
      setCached(json.cached ?? false);

      // Refresh history
      fetch('/api/analyze')
        .then((r) => r.json())
        .then((h) => { if (h.success) setHistory(h.data); })
        .catch(() => {});
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleHistorySelect(item: HistoryItem) {
    // Load a history preview — show summary as a lightweight result
    setAnalysis({
      _id: item._id,
      summary: item.summary,
      riskLevel: item.riskLevel,
      riskRationale: '',
      shenanigans: [],
      highlights: [],
      legalClarity: { score: 0, label: '', explanation: '' },
      modelUsed: '',
      tokensUsed: 0,
      processingTimeMs: 0,
      createdAt: item.createdAt,
    });
    setCached(true);
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Hero */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
            Understand any Terms & Conditions
          </h1>
          <p className="mt-2 text-base text-zinc-500 dark:text-zinc-400">
            Paste legal text and get instant AI-powered clarity — hidden costs, risk level, key points, and more.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left column: input */}
          <div className="flex flex-col gap-4">
            <InputPanel onSubmit={handleAnalyze} isLoading={isLoading} />
            <HistoryPanel items={history} onSelect={handleHistorySelect} />
          </div>

          {/* Right column: results */}
          <div>
            {error && (
              <div className="mb-4 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 dark:border-red-800 dark:bg-red-900/20">
                <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            {isLoading && <LoadingOverlay />}

            {!isLoading && analysis && (
              <ResultsPanel
                analysis={analysis}
                processingMs={analysis.processingTimeMs}
                cached={cached}
              />
            )}

            {!isLoading && !analysis && !error && (
              <div className="flex h-full min-h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 p-10 text-center dark:border-zinc-700 dark:bg-zinc-900/50">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-900/40">
                  <span className="text-2xl">⚖️</span>
                </div>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Your analysis will appear here
                </p>
                <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                  Paste any Terms of Service, Privacy Policy, or legal agreement to get started
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-12 border-t border-zinc-200 py-6 text-center dark:border-zinc-800">
        <p className="text-xs text-zinc-400 dark:text-zinc-600">
          Powered by GPT-4o · Not legal advice · For informational purposes only
        </p>
      </footer>
    </div>
  );
}
