import SummaryCard from './SummaryCard';
import ShenanigansCard from './ShenanigansCard';
import HighlightsCard from './HighlightsCard';
import ClarityCard from './ClarityCard';
import type { AnalysisResponse } from '@/types/analysis';

interface Props {
  analysis: AnalysisResponse;
  processingMs?: number;
  cached?: boolean;
}

export default function ResultsPanel({ analysis, processingMs, cached }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Analysis Results</h2>
        <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">
          {cached && (
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
              cached
            </span>
          )}
          {processingMs !== undefined && !cached && (
            <span>{(processingMs / 1000).toFixed(1)}s via Qwen3.5-Flash</span>
          )}
        </div>
      </div>

      <SummaryCard
        summary={analysis.summary}
        riskLevel={analysis.riskLevel}
        riskRationale={analysis.riskRationale}
      />
      <ShenanigansCard shenanigans={analysis.shenanigans} />
      <HighlightsCard highlights={analysis.highlights} />
      <ClarityCard legalClarity={analysis.legalClarity} />
    </div>
  );
}
