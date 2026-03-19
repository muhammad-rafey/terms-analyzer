'use client';

import { Sun, Moon, ShieldCheck } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function Header() {
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/60 bg-zinc-50/80 backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600 dark:bg-teal-500">
            <ShieldCheck size={14} className="text-white" />
          </div>
          <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Terms Analyzer
          </span>
        </div>

        <button
          onClick={toggle}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-200/60 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        >
          {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
        </button>
      </div>
    </header>
  );
}
