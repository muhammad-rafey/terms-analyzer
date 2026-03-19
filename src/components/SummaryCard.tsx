import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';
import type { RiskLevel } from '@/types/analysis';

interface Props {
  summary: string;
  riskLevel: RiskLevel;
  riskRationale: string;
}

const cfg = {
  LOW: {
    icon: ShieldCheck,
    label: 'Low Risk',
    headerBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    labelColor: 'text-emerald-800 dark:text-emerald-300',
  },
  MEDIUM: {
    icon: ShieldAlert,
    label: 'Medium Risk',
    headerBg: 'bg-amber-50 dark:bg-amber-950/40',
    iconColor: 'text-amber-600 dark:text-amber-400',
    labelColor: 'text-amber-800 dark:text-amber-300',
  },
  HIGH: {
    icon: ShieldX,
    label: 'High Risk',
    headerBg: 'bg-red-50 dark:bg-red-950/40',
    iconColor: 'text-red-600 dark:text-red-400',
    labelColor: 'text-red-800 dark:text-red-300',
  },
};

export default function SummaryCard({ summary, riskLevel, riskRationale }: Props) {
  const c = cfg[riskLevel];
  const Icon = c.icon;

  return (
    <article className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
      {/* Risk header strip */}
      <div className={`flex items-center gap-2.5 px-5 py-3 ${c.headerBg}`}>
        <Icon size={16} className={c.iconColor} aria-hidden="true" />
        <h2 className={`text-sm font-bold ${c.labelColor}`}>{c.label}</h2>
      </div>

      {/* Body */}
      <div className="bg-white p-5 dark:bg-zinc-900">
        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{summary}</p>
        {riskRationale && (
          <p className="mt-3 border-t border-zinc-100 pt-3 text-xs leading-relaxed text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            <span className="font-semibold">Risk rationale: </span>
            {riskRationale}
          </p>
        )}
      </div>
    </article>
  );
}
