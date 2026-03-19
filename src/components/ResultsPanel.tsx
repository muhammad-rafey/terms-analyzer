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
  const isFullAnalysis = analysis.riskRationale !== '';

  return (
    <div>
      {/* Divider with metadata */}
      <div className="mb-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
        <div className="flex items-center gap-2.5 text-[11px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          <span className="font-semibold">Report</span>
          {cached && (
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium normal-case tracking-normal text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
              cached
            </span>
          )}
          {processingMs !== undefined && processingMs > 0 && !cached && (
            <span className="font-mono font-normal normal-case tracking-normal">
              {(processingMs / 1000).toFixed(1)}s
            </span>
          )}
        </div>
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
      </div>

      <div className="space-y-4">
        <div className="anim-fade-in-up anim-stagger-1">
          <SummaryCard
            summary={analysis.summary}
            riskLevel={analysis.riskLevel}
            riskRationale={analysis.riskRationale}
          />
        </div>

        {(isFullAnalysis || analysis.shenanigans.length > 0) && (
          <div className="anim-fade-in-up anim-stagger-2">
            <ShenanigansCard shenanigans={analysis.shenanigans} />
          </div>
        )}

        {analysis.highlights.length > 0 && (
          <div className="anim-fade-in-up anim-stagger-3">
            <HighlightsCard highlights={analysis.highlights} />
          </div>
        )}

        {analysis.legalClarity.score > 0 && (
          <div className="anim-fade-in-up anim-stagger-4">
            <ClarityCard legalClarity={analysis.legalClarity} />
          </div>
        )}
      </div>
    </div>
  );
}
