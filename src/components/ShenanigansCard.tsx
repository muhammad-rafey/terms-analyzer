import { AlertTriangle, CheckCircle } from 'lucide-react';
import RiskBadge from './RiskBadge';
import type { Shenanigan } from '@/types/analysis';

interface Props {
  shenanigans: Shenanigan[];
}

export default function ShenanigansCard({ shenanigans }: Props) {
  const sorted = [...shenanigans].sort((a, b) => {
    const order = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    return order[a.severity] - order[b.severity];
  });

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/40">
          <AlertTriangle size={16} className="text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Potential Issues & Hidden Costs
        </h2>
        {sorted.length > 0 && (
          <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-700 dark:bg-red-900/40 dark:text-red-300">
            {sorted.length}
          </span>
        )}
      </div>

      {sorted.length === 0 ? (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 dark:bg-emerald-900/20">
          <CheckCircle size={16} className="text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm text-emerald-700 dark:text-emerald-300">
            No major issues or hidden costs detected.
          </span>
        </div>
      ) : (
        <ul className="space-y-3">
          {sorted.map((s, i) => (
            <li
              key={i}
              className="rounded-xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900/50"
            >
              <div className="mb-1.5 flex items-center gap-2">
                <RiskBadge level={s.severity} size="sm" />
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  {s.clause}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                {s.explanation}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
