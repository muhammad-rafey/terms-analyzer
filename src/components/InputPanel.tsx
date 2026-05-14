'use client';

import { useState, useRef } from 'react';
import { ArrowRight, X, Loader2, Upload } from 'lucide-react';

interface Props {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

const MAX_CHARS = 100_000;
const WARN_CHARS = 80_000;

export default function InputPanel({ onSubmit, isLoading }: Props) {
  const [text, setText] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (text.trim().length >= 50 && !isLoading) {
      onSubmit(text);
    }
  }

  async function extractPdfText(file: File): Promise<string> {
    const pdfjs = await import('pdfjs-dist');
    pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    const pages: string[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      pages.push(
        content.items
          .map((item) => ('str' in item ? item.str : ''))
          .join(' '),
      );
    }
    return pages.join('\n\n');
  }

  async function extractDocxText(file: File): Promise<string> {
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }

  async function extractDocText(file: File): Promise<string> {
    const body = new FormData();
    body.append('file', file);
    const res = await fetch('/api/parse-doc', { method: 'POST', body });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error ?? 'Could not parse .doc file.');
    }
    return json.text as string;
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setUploadError(null);

    if (file.size > 2 * 1024 * 1024) {
      setUploadError('File is too large (max 2MB).');
      return;
    }

    const ext = file.name.toLowerCase().match(/\.([^.]+)$/)?.[1] ?? '';

    if (ext !== 'txt' && ext !== 'pdf' && ext !== 'doc' && ext !== 'docx') {
      setUploadError('Only PDF, TXT, and Word (.doc, .docx) files are supported.');
      return;
    }

    try {
      let content: string;
      if (ext === 'pdf') {
        content = await extractPdfText(file);
      } else if (ext === 'docx') {
        content = await extractDocxText(file);
      } else if (ext === 'doc') {
        content = await extractDocText(file);
      } else {
        content = await file.text();
      }
      setText(content.slice(0, MAX_CHARS));
    } catch {
      setUploadError('Could not read the file. Please try another.');
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
            className="absolute right-3 top-3 flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            <X size={13} />
          </button>
        )}
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.doc,.docx,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFile}
            className="hidden"
            aria-hidden="true"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            aria-label="Upload a document"
            title="Upload a document (PDF, TXT, Word)"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition hover:border-teal-500 hover:text-teal-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-teal-400 dark:hover:text-teal-400"
          >
            <Upload size={14} />
          </button>

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
        </div>

        <button
          type="submit"
          disabled={isTooShort || isOverLimit || isLoading}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-teal-500 dark:hover:bg-teal-600"
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

      {uploadError && (
        <p role="alert" className="mt-2 text-xs text-red-500 dark:text-red-400">
          {uploadError}
        </p>
      )}
    </form>
  );
}
