'use client';

import { useState } from 'react';
import { History, ChevronDown, ChevronUp } from 'lucide-react';
import RiskBadge from './RiskBadge';
import type { HistoryItem } from '@/types/analysis';

interface Props {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

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
  const [open, setOpen] = useState(false);

  if (items.length === 0) return null;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-2">
          <History size={15} className="text-zinc-500 dark:text-zinc-400" />
          <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Recent Analyses
          </span>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
            {items.length}
          </span>
        </div>
        {open ? (
          <ChevronUp size={15} className="text-zinc-400" />
        ) : (
          <ChevronDown size={15} className="text-zinc-400" />
        )}
      </button>

      {open && (
        <div className="border-t border-zinc-100 dark:border-zinc-700">
          {items.map((item) => (
            <button
              key={item._id}
              onClick={() => onSelect(item)}
              className="flex w-full items-start gap-3 px-5 py-3 text-left transition hover:bg-zinc-50 dark:hover:bg-zinc-700/50"
            >
              <RiskBadge level={item.riskLevel} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-zinc-700 dark:text-zinc-300">{item.preview}…</p>
                <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">{timeAgo(item.createdAt)}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
