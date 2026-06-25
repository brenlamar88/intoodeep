import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { StoryCard } from "@/components/site/StoryCard";
import { getPublishedPosts } from "@/lib/posts";
import { SITE } from "@/lib/site";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "All stories",
  description: `Every story from ${SITE.name} — honest writing on single motherhood, co-parenting, grief, money, and coming up for air.`,
  alternates: { canonical: "/blog" },
};

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <SiteNav />
      <section className="py-16">
        <div className="wrap">
          <div className="text-[12.5px] tracking-[2.6px] uppercase text-surface font-semibold mb-[18px]">
            The library
          </div>
          <h1 className="font-display font-medium text-[clamp(32px,4.6vw,48px)] leading-[1.1] m-0 mb-3">
            Every story, in one place.
          </h1>
          <p className="text-[16px] text-[var(--foam-soft)] max-w-[560px] m-0 mb-[40px]">
            Read at your own pace — start wherever you are tonight.
          </p>

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((post, i) => (
                <StoryCard key={post.id} post={post} index={i} />
              ))}
            </div>
          ) : (
            <div className="bg-deep border border-[var(--line)] rounded-[16px] p-10 text-center">
              <p className="text-[var(--foam-soft)] m-0">
                No stories published yet.{" "}
                <Link href="/#join" className="text-surface-soft underline">
                  Join the Sunday letter
                </Link>{" "}
                to be first to read them.
              </p>
            </div>
          )}
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
