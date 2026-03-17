import { BookOpen } from 'lucide-react';
import type { LegalClarity } from '@/types/analysis';

interface Props {
  legalClarity: LegalClarity;
}

function getScoreColor(score: number) {
  if (score >= 8) return { bar: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' };
  if (score >= 5) return { bar: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' };
  return { bar: 'bg-red-500', text: 'text-red-600 dark:text-red-400' };
}

export default function ClarityCard({ legalClarity }: Props) {
  const { score, label, explanation } = legalClarity;
  const { bar, text } = getScoreColor(score);
  const pct = (score / 10) * 100;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/40">
          <BookOpen size={16} className="text-purple-600 dark:text-purple-400" />
        </div>
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Legal Clarity</h2>
      </div>

      <div className="mb-4 flex items-end gap-3">
        <span className={`text-4xl font-bold ${text}`}>{score}</span>
        <span className="mb-1 text-sm text-zinc-500 dark:text-zinc-400">/ 10</span>
        <span className={`mb-1 ml-auto text-sm font-medium ${text}`}>{label}</span>
      </div>

      <div className="mb-4 h-2.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-700">
        <div
          className={`h-full rounded-full transition-all duration-500 ${bar}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">{explanation}</p>
    </div>
  );
}
