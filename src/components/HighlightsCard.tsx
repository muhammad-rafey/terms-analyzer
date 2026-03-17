import { ListChecks } from 'lucide-react';

interface Props {
  highlights: string[];
}

export default function HighlightsCard({ highlights }: Props) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/40">
          <ListChecks size={16} className="text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Key Points to Know
        </h2>
      </div>
      <ol className="space-y-2.5">
        {highlights.map((point, i) => (
          <li key={i} className="flex gap-3">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 mt-0.5">
              {i + 1}
            </span>
            <span className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {point}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
