import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist. Return to Terms Analyzer to analyze your legal documents.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <h1 className="text-6xl font-black tracking-tight text-zinc-300 dark:text-zinc-700">404</h1>
      <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
        This page doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
      >
        Back to analyzer
      </Link>
    </main>
  );
}
