'use client';

import { useState } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

interface Props {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

const MAX_CHARS = 100_000;
const WARN_CHARS = 80_000;

export default function InputPanel({ onSubmit, isLoading }: Props) {
  const [text, setText] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (text.trim().length >= 50 && !isLoading) {
      onSubmit(text);
    }
  }

  const charCount = text.length;
  const isOverLimit = charCount > MAX_CHARS;
  const isNearLimit = charCount > WARN_CHARS;
  const isTooShort = text.trim().length < 50;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Paste Terms & Conditions
        </h2>
        {text && (
          <button
            type="button"
            onClick={() => setText('')}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
          >
            <X size={12} />
            Clear
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the full text of any Terms of Service, Privacy Policy, EULA, or legal agreement here..."
          rows={14}
          className="w-full resize-y rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-800 placeholder-zinc-400 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:placeholder-zinc-600 dark:focus:border-indigo-500 dark:focus:ring-indigo-900/30"
          disabled={isLoading}
        />

        <div className="mt-2 flex items-center justify-between">
          <span
            className={`text-xs ${
              isOverLimit
                ? 'text-red-600 dark:text-red-400'
                : isNearLimit
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-zinc-400 dark:text-zinc-500'
            }`}
          >
            {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()} characters
            {isOverLimit && ' — exceeds limit'}
            {isNearLimit && !isOverLimit && ' — approaching limit'}
          </span>

          <button
            type="submit"
            disabled={isTooShort || isOverLimit || isLoading}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            {isLoading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search size={15} />
                Analyze
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
