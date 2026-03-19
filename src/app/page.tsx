'use client';

import { useState, useEffect, useRef } from 'react';
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
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/analyze')
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setHistory(json.data);
      })
      .catch((err) => console.warn('[history] Failed to load:', err));
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

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

      // Refresh history
      fetch('/api/analyze')
        .then((r) => r.json())
        .then((h) => { if (h.success) setHistory(h.data); })
        .catch((err) => console.warn('[history] Failed to refresh:', err));
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleHistorySelect(item: HistoryItem) {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const res = await fetch(`/api/analyze?id=${item._id}`);
      const json = await res.json();

      if (!json.success) {
        setError(json.error ?? 'Failed to load analysis.');
        return;
      }

      setAnalysis(json.data);
      setCached(true);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Header />

      <main id="main-content" className="mx-auto max-w-3xl px-5 pb-16 pt-8 sm:px-6">
        {/* Hero / intro */}
        <section aria-labelledby="page-heading" className="mb-5">
          <h1
            id="page-heading"
            className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl"
          >
            Analyze Terms & Conditions
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Paste any legal document. Get instant clarity on risks, hidden costs, and what matters.
          </p>
        </section>

        {/* Input */}
        <section aria-label="Paste your legal document">
          <InputPanel onSubmit={handleAnalyze} isLoading={isLoading} />
        </section>

        {/* History */}
        {history.length > 0 && (
          <nav aria-label="Recent analyses" className="mt-5">
            <HistoryPanel items={history} onSelect={handleHistorySelect} />
          </nav>
        )}

        {/* Results area */}
        <section
          ref={resultsRef}
          aria-label="Analysis results"
          aria-live="polite"
          className="mt-8 scroll-mt-16"
        >
          {error && (
            <div role="alert" className="mb-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 dark:border-red-900/50 dark:bg-red-950/30">
              <AlertCircle size={15} className="mt-0.5 shrink-0 text-red-500 dark:text-red-400" aria-hidden="true" />
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
            <p className="py-12 text-center text-xs text-zinc-400 dark:text-zinc-600">
              Your analysis results will appear here
            </p>
          )}
        </section>
      </main>

      <footer className="border-t border-zinc-200/60 py-5 text-center dark:border-zinc-800/60">
        <p className="text-xs text-zinc-400 dark:text-zinc-600">
          Powered by Qwen3.5-Flash · Not legal advice · For informational purposes only
        </p>
      </footer>
    </div>
  );
}
