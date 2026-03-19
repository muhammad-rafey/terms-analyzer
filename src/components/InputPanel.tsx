'use client';

import { useState } from 'react';
import { ArrowRight, X, Loader2 } from 'lucide-react';

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
    <form onSubmit={handleSubmit}>
      <div className="relative">
        <label htmlFor="legal-text-input" className="sr-only">
          Paste your Terms of Service, Privacy Policy, or legal agreement
        </label>
        <textarea
          id="legal-text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste any Terms of Service, Privacy Policy, EULA, or legal agreement here..."
          rows={7}
          className="w-full resize-y rounded-xl border border-zinc-200 bg-white px-4 py-3.5 pr-10 text-sm leading-relaxed text-zinc-800 placeholder-zinc-400 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:placeholder-zinc-600 dark:focus:border-teal-400 dark:focus:ring-teal-400/15"
          disabled={isLoading}
        />
        {text && !isLoading && (
          <button
            type="button"
            onClick={() => setText('')}
            aria-label="Clear text"
            className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-md text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            <X size={13} />
          </button>
        )}
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-4">
        <span
          className={`font-mono text-xs tabular-nums ${
            isOverLimit
              ? 'text-red-500 dark:text-red-400'
              : isNearLimit
              ? 'text-amber-500 dark:text-amber-400'
              : 'text-zinc-400 dark:text-zinc-500'
          }`}
        >
          {charCount > 0 ? (
            <>
              {charCount.toLocaleString()}/{MAX_CHARS.toLocaleString()}
              {isOverLimit && ' — over limit'}
              {isNearLimit && !isOverLimit && ' — near limit'}
            </>
          ) : (
            <span className="invisible">0</span>
          )}
        </span>

        <button
          type="submit"
          disabled={isTooShort || isOverLimit || isLoading}
          className="flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-teal-500 dark:hover:bg-teal-600"
        >
          {isLoading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              Analyze
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
