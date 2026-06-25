import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { getPublishedPostBySlug, getPublishedSlugs } from "@/lib/posts";
import { sanitizeHtml } from "@/lib/sanitize";
import { SITE, getSiteUrl } from "@/lib/site";
import { formatDate, htmlToText } from "@/lib/utils";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return { title: "Story not found" };

  const title = post.meta_title || post.title;
  const description =
    post.meta_description || post.excerpt || htmlToText(post.content_html, 160);
  const url = `${getSiteUrl()}/blog/${post.slug}`;
  const ogImage = post.og_image_url || post.cover_image_url || undefined;

  return {
    title,
    description,
    alternates: { canonical: post.canonical_url || `/blog/${post.slug}` },
    robots: post.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at,
      authors: post.author_name ? [post.author_name] : undefined,
      images: ogImage ? [{ url: ogImage, alt: post.cover_image_alt || title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  const description =
    post.meta_description || post.excerpt || htmlToText(post.content_html, 160);
  const url = `${getSiteUrl()}/blog/${post.slug}`;
  const ogImage = post.og_image_url || post.cover_image_url || undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description,
    image: ogImage ? [ogImage] : undefined,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    author: post.author_name
      ? { "@type": "Person", name: post.author_name }
      : { "@type": "Organization", name: SITE.name },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: getSiteUrl(),
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  return (
    <>
      <SiteNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="py-14">
        <div className="wrap" style={{ maxWidth: 760 }}>
          <Link href="/blog" className="text-[14px] text-surface hover:text-surface-soft">
            ← All stories
          </Link>

          <header className="mt-7 mb-9">
            {post.category && (
              <span className="inline-block text-[11px] tracking-[1.2px] uppercase font-semibold text-surface-soft bg-[rgba(95,201,201,0.12)] px-[11px] py-[5px] rounded-full mb-5">
                {post.category}
              </span>
            )}
            <h1 className="font-display font-medium text-[clamp(30px,4.8vw,46px)] leading-[1.1] tracking-[-0.4px] m-0 mb-5">
              {post.title}
            </h1>
            <div className="text-[13.5px] text-[var(--foam-soft)] flex flex-wrap gap-x-3 gap-y-1 items-center">
              {post.author_name && <span>By {post.author_name}</span>}
              {post.published_at && <span>· {formatDate(post.published_at)}</span>}
              <span>· {post.read_minutes ?? 5} min read</span>
            </div>
          </header>

          {post.cover_image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.cover_image_url}
              alt={post.cover_image_alt || post.title}
              className="w-full rounded-[16px] border border-[var(--line)] mb-10"
            />
          )}

          <div
            className="prose-deep"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content_html) }}
          />

          <div className="mt-14 pt-8 border-t border-[var(--line)]">
            <div
              className="rounded-[18px] border border-[var(--line-strong)] px-8 py-9 text-center"
              style={{ background: "linear-gradient(135deg,var(--deep-3),var(--deep))" }}
            >
              <h3 className="font-display font-medium text-[22px] m-0 mb-2">
                One honest letter, every Sunday.
              </h3>
              <p className="text-[14px] text-[var(--foam-soft)] m-0 mb-5 max-w-[420px] mx-auto">
                If this found you at the right time, come tread the water with us.
              </p>
              <Link href="/#join" className="inline-block bg-coral hover:bg-coral-soft text-abyss font-semibold text-[15px] px-[26px] py-[13px] rounded-full">
                Join free
              </Link>
            </div>
          </div>
        </div>
      </article>
      <SiteFooter />
    </>
  );
}
