/**
 * Returns the canonical public URL for this deployment.
 * Priority:
 *   1. NEXT_PUBLIC_SITE_URL (user-provided, e.g. custom domain)
 *   2. VERCEL_PROJECT_PRODUCTION_URL (Vercel's auto-injected prod URL)
 *   3. VERCEL_URL (preview deployments)
 *   4. http://localhost:3000 (local dev)
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, '');

  const prodUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (prodUrl) return `https://${prodUrl}`;

  const previewUrl = process.env.VERCEL_URL;
  if (previewUrl) return `https://${previewUrl}`;

  return 'http://localhost:3000';
}
