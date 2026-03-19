import { Lightbulb } from 'lucide-react';

interface Props {
  highlights: string[];
}

export default function HighlightsCard({ highlights }: Props) {
  if (highlights.length === 0) return null;

  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="mb-4 flex items-center gap-2">
        <Lightbulb size={14} className="text-zinc-500 dark:text-zinc-400" aria-hidden="true" />
        <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
          Key Highlights
        </h2>
      </div>
      <ol className="space-y-3">
        {highlights.map((point, i) => (
          <li key={i} className="flex gap-3">
            <span aria-hidden="true" className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 font-mono text-[10px] font-bold text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
              {i + 1}
            </span>
            <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{point}</p>
          </li>
        ))}
      </ol>
    </article>
  );
}
