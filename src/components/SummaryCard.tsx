import { FileText } from 'lucide-react';
import RiskBadge from './RiskBadge';
import type { RiskLevel } from '@/types/analysis';

interface Props {
  summary: string;
  riskLevel: RiskLevel;
  riskRationale: string;
}

export default function SummaryCard({ summary, riskLevel, riskRationale }: Props) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/40">
            <FileText size={16} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Summary</h2>
        </div>
        <RiskBadge level={riskLevel} size="md" />
      </div>
      <p className="mb-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{summary}</p>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        <span className="font-medium">Risk assessment: </span>
        {riskRationale}
      </p>
    </div>
  );
}
