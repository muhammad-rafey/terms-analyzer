import type { Metadata } from 'next';
import { getSiteUrl } from '@/lib/site';

const pageTitle = 'Analyze your Terms & Conditions';
const pageDescription =
  'Paste any Terms of Service, Privacy Policy, or EULA and get an instant AI-powered analysis: plain-English summary, risk level, hidden costs, and clarity score.';

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: '/analyzer' },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: '/analyzer',
  },
  twitter: {
    title: pageTitle,
    description: pageDescription,
  },
};

export default function AnalyzerLayout({ children }: { children: React.ReactNode }) {
  const siteUrl = getSiteUrl();
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Analyzer',
        item: new URL('/analyzer', siteUrl).toString(),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
