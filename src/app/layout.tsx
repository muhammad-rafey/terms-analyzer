import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { getSiteUrl } from '@/lib/site';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

/* ── SEO: auto-detected from Vercel env; override via NEXT_PUBLIC_SITE_URL ── */
const SITE_URL = getSiteUrl();

const title = 'Terms Analyzer — AI-Powered Legal Clarity for Terms & Conditions';
const description =
  'Free AI tool to analyze Terms & Conditions, Privacy Policies, and EULAs. Get a plain-English summary, risk assessment, hidden-cost detection, and key highlights instantly.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: '%s | Terms Analyzer',
  },
  description,
  applicationName: 'Terms Analyzer',
  keywords: [
    'terms and conditions analyzer',
    'AI legal analysis',
    'terms of service reader',
    'privacy policy analyzer',
    'EULA analyzer',
    'legal document summary',
    'hidden costs finder',
    'risk assessment tool',
    'plain English legal summary',
    'free legal AI tool',
  ],
  authors: [{ name: 'Terms Analyzer' }],
  creator: 'Terms Analyzer',
  publisher: 'Terms Analyzer',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Terms Analyzer',
    title,
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Terms Analyzer',
    url: SITE_URL,
    description,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'AI-powered Terms & Conditions analysis',
      'Plain-English summary generation',
      'Risk level assessment',
      'Hidden cost and problematic clause detection',
      'Legal clarity scoring',
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Anti-flash: set dark class before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var p=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';if(t==='dark'||(t===null&&p==='dark'))document.documentElement.classList.add('dark')}catch(e){}})()`,
          }}
        />
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-teal-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to main content
        </a>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
