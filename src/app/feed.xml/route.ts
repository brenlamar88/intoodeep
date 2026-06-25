import { getPublishedPosts } from "@/lib/posts";
import { SITE, getSiteUrl } from "@/lib/site";
import { htmlToText } from "@/lib/utils";

export const revalidate = 300;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const base = getSiteUrl();
  const posts = await getPublishedPosts(50);

  const items = posts
    .map((p) => {
      const link = `${base}/blog/${p.slug}`;
      const desc = p.excerpt || htmlToText(p.content_html, 280);
      const date = new Date(p.published_at || p.created_at).toUTCString();
      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${date}</pubDate>
      ${p.category ? `<category>${escapeXml(p.category)}</category>` : ""}
      <description>${escapeXml(desc)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE.name)}</title>
    <link>${base}</link>
    <description>${escapeXml(SITE.description)}</description>
    <language>en-us</language>
    <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${base}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
