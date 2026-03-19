import { AlertTriangle, CheckCircle } from 'lucide-react';
import type { Shenanigan } from '@/types/analysis';

interface Props {
  shenanigans: Shenanigan[];
}

const sev = {
  HIGH: {
    border: 'border-l-red-500',
    bg: 'bg-red-50/60 dark:bg-red-950/20',
    tag: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    label: 'High',
  },
  MEDIUM: {
    border: 'border-l-amber-500',
    bg: 'bg-amber-50/60 dark:bg-amber-950/20',
    tag: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    label: 'Med',
  },
  LOW: {
    border: 'border-l-emerald-500',
    bg: 'bg-emerald-50/60 dark:bg-emerald-950/20',
    tag: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    label: 'Low',
  },
};

export default function ShenanigansCard({ shenanigans }: Props) {
  const sorted = [...shenanigans].sort((a, b) => {
    const order = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    return order[a.severity] - order[b.severity];
  });

  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="mb-4 flex items-center gap-2">
        <AlertTriangle size={14} className="text-zinc-500 dark:text-zinc-400" aria-hidden="true" />
        <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
          Issues & Hidden Costs
        </h2>
        {sorted.length > 0 && (
          <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-100 px-1.5 font-mono text-[10px] font-bold text-red-700 dark:bg-red-900/40 dark:text-red-300">
            {sorted.length}
          </span>
        )}
      </div>

      {sorted.length === 0 ? (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 dark:bg-emerald-950/30">
          <CheckCircle size={14} className="text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm text-emerald-700 dark:text-emerald-300">
            No major issues or hidden costs detected.
          </span>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((s, i) => {
            const c = sev[s.severity];
            return (
              <div
                key={i}
                className={`rounded-lg border-l-[3px] ${c.border} ${c.bg} py-3 pl-4 pr-4`}
              >
                <div className="mb-1.5 flex items-center gap-2">
                  <span
                    className={`rounded px-1.5 py-px text-[10px] font-bold uppercase tracking-wide ${c.tag}`}
                  >
                    {c.label}
                  </span>
                  <span className="text-[13px] font-semibold text-zinc-800 dark:text-zinc-200">
                    {s.clause}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {s.explanation}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </article>
  );
}
