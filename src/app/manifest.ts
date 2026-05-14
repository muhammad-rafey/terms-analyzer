import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Terms Analyzer — AI-Powered Legal Clarity',
    short_name: 'Terms Analyzer',
    description:
      'Free AI tool to analyze Terms & Conditions, Privacy Policies, and EULAs. Plain-English summaries, risk assessment, and hidden-cost detection.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fafafa',
    theme_color: '#0d9488',
    categories: ['productivity', 'utilities'],
    icons: [
      { src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
    ],
  };
}
