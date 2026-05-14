import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';

const pageTitle = 'Terms Analyzer — Understand any T&C in seconds';
const pageDescription =
  'Free AI tool that turns dense Terms & Conditions, Privacy Policies, and EULAs into plain-English summaries. Spot risks, hidden costs, and key clauses instantly.';

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: '/' },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: '/',
  },
  twitter: {
    title: pageTitle,
    description: pageDescription,
  },
};

const faqs = [
  {
    q: 'Is Terms Analyzer free to use?',
    a: 'Yes. Terms Analyzer is completely free — no signup, no credit card, no hidden tiers.',
  },
  {
    q: 'Is my document stored or shared?',
    a: 'Analyses may be cached to speed up repeat lookups, but documents are never sold or shared. The tool is designed for informational use only.',
  },
  {
    q: 'What documents can I analyze?',
    a: 'Any text-based legal document: Terms of Service, Privacy Policies, EULAs, cookie notices, refund policies, and user agreements. Paste the text directly or upload a .txt, .md, .html, or .json file.',
  },
];

export default function Landing() {
  const steps = [
    { icon: FileText, title: 'Paste your document', body: 'Drop in any T&C, privacy policy, or EULA.' },
    { icon: Sparkles, title: 'AI analyzes instantly', body: 'Risks, hidden costs, and key clauses surfaced.' },
    { icon: ShieldCheck, title: 'Read in plain English', body: 'Get a clear summary and clarity score.' },
  ];

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Header />

      <main id="main-content" className="mx-auto max-w-3xl px-5 pb-16 pt-12 sm:px-6 sm:pt-16">
        {/* Hero */}
        <section className="anim-fade-in-up text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
            Understand any Terms & Conditions in seconds
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-500 dark:text-zinc-400 sm:text-base">
            AI-powered clarity on risks, hidden costs, and what really matters.
          </p>
        </section>

        {/* How it works */}
        <section aria-labelledby="how-heading" className="mt-12 sm:mt-16">
          <h2
            id="how-heading"
            className="text-center text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
          >
            How it works
          </h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-3">
            {steps.map(({ icon: Icon, title, body }, i) => (
              <li
                key={i}
                className="rounded-xl border border-zinc-200/60 bg-white p-5 dark:border-zinc-800/60 dark:bg-zinc-900/40"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600 dark:bg-teal-500">
                  <Icon size={16} className="text-white" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* CTA */}
        <section className="mt-12 text-center sm:mt-16">
          <Link
            href="/analyzer"
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-400"
          >
            Analyze a document <ArrowRight size={15} />
          </Link>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq-heading" className="mt-16 sm:mt-20">
          <h2
            id="faq-heading"
            className="text-center text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
          >
            Frequently asked questions
          </h2>
          <dl className="mt-6 divide-y divide-zinc-200/60 rounded-xl border border-zinc-200/60 bg-white dark:divide-zinc-800/60 dark:border-zinc-800/60 dark:bg-zinc-900/40">
            {faqs.map((f, i) => (
              <div key={i} className="px-5 py-4 sm:px-6">
                <dt className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{f.q}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>

      <footer className="border-t border-zinc-200/60 py-5 text-center dark:border-zinc-800/60">
        <p className="text-xs text-zinc-400 dark:text-zinc-600">
 Powered by Qwen3.5-Flash · Not legal advice · For informational purposes only        </p>
      </footer>
    </div>
  );
}
