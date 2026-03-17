'use client';

import { Sun, Moon, ShieldCheck } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function Header() {
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-700 dark:bg-zinc-900/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 dark:bg-indigo-500">
            <ShieldCheck size={16} className="text-white" />
          </div>
          <div>
            <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Terms Analyzer
            </span>
            <span className="ml-2 text-xs text-zinc-400 dark:text-zinc-500 hidden sm:inline">
              AI-powered legal clarity
            </span>
          </div>
        </div>

        <button
          onClick={toggle}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:bg-zinc-700"
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </div>
    </header>
  );
}
