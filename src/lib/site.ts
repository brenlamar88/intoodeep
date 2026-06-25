/** Central place for site-wide constants used across SEO + UI. */
export const SITE = {
  name: "InTooDeep",
  title: "InTooDeep — honest stories for single moms in the deep end",
  description:
    "Honest stories, hard-won lessons, and a community of single moms in the deep end together — what keeps us afloat, what doesn't, and everything nobody warns you about.",
  tagline: "A community for single moms",
  twitter: "@intoodeep",
  locale: "en_US",
};

/**
 * The canonical public URL of the site. Set NEXT_PUBLIC_SITE_URL in the
 * environment (Vercel) so SEO tags, sitemap and RSS resolve to real URLs.
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
