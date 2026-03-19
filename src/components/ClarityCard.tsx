import { Eye } from 'lucide-react';
import type { LegalClarity } from '@/types/analysis';

interface Props {
  legalClarity: LegalClarity;
}

function getColors(score: number) {
  if (score >= 8)
    return {
      bar: 'bg-emerald-500',
      text: 'text-emerald-600 dark:text-emerald-400',
      track: 'bg-emerald-100 dark:bg-emerald-900/30',
    };
  if (score >= 5)
    return {
      bar: 'bg-amber-500',
      text: 'text-amber-600 dark:text-amber-400',
      track: 'bg-amber-100 dark:bg-amber-900/30',
    };
  return {
    bar: 'bg-red-500',
    text: 'text-red-600 dark:text-red-400',
    track: 'bg-red-100 dark:bg-red-900/30',
  };
}

export default function ClarityCard({ legalClarity }: Props) {
  const { score, label, explanation } = legalClarity;
  const { bar, text, track } = getColors(score);
  const pct = (score / 10) * 100;

  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="mb-4 flex items-center gap-2">
        <Eye size={14} className="text-zinc-500 dark:text-zinc-400" aria-hidden="true" />
        <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Legal Clarity</h2>
      </div>

      <div className="mb-3 flex items-baseline gap-1.5">
        <span className={`font-mono text-3xl font-black tracking-tight ${text}`}>{score}</span>
        <span className="text-sm text-zinc-400 dark:text-zinc-500">/10</span>
        <span className={`ml-auto text-sm font-semibold ${text}`}>{label}</span>
      </div>

      <div className={`mb-4 h-1.5 w-full overflow-hidden rounded-full ${track}`}>
        <div
          className={`h-full rounded-full anim-bar-fill ${bar}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">{explanation}</p>
    </article>
  );
}
