'use client';

import { Clock } from 'lucide-react';
import type { HistoryItem } from '@/types/analysis';

interface Props {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

const riskDot: Record<string, string> = {
  LOW: 'bg-emerald-500',
  MEDIUM: 'bg-amber-500',
  HIGH: 'bg-red-500',
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function HistoryPanel({ items, onSelect }: Props) {
  if (items.length === 0) return null;

  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5">
        <Clock size={11} className="text-zinc-400 dark:text-zinc-500" />
        <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Recent
        </span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 scroll-thin">
        {items.map((item) => (
          <button
            key={item._id}
            onClick={() => onSelect(item)}
            className="flex shrink-0 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-left transition hover:border-zinc-300 hover:shadow-sm dark:border-zinc-700 dark:bg-zinc-800/80 dark:hover:border-zinc-600"
          >
            <span className={`h-1.5 w-1.5 rounded-full ${riskDot[item.riskLevel]}`} />
            <span className="max-w-[160px] truncate text-xs text-zinc-600 dark:text-zinc-300">
              {item.preview}
            </span>
            <span className="whitespace-nowrap text-[10px] text-zinc-400 dark:text-zinc-500">
              {timeAgo(item.createdAt)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
