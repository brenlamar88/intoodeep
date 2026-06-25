import type { MetadataRoute } from "next";
import { getPublishedSlugs } from "@/lib/posts";
import { getSiteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const slugs = await getPublishedSlugs();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/blog`, changeFrequency: "daily", priority: 0.9 },
  ];

  const postRoutes: MetadataRoute.Sitemap = slugs.map((s) => ({
    url: `${base}/blog/${s.slug}`,
    lastModified: new Date(s.updated_at),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...postRoutes];
}
