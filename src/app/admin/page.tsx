import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";
import { PostList } from "@/components/admin/PostList";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .order("updated_at", { ascending: false });
  const posts = (data as Post[]) ?? [];

  const published = posts.filter((p) => p.status === "published").length;
  const drafts = posts.length - published;

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-medium text-[28px] m-0">Posts</h1>
          <p className="text-[14px] text-[var(--foam-soft)] m-0 mt-1">
            {posts.length} total · {published} published · {drafts} draft
            {drafts === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="bg-coral hover:bg-coral-soft text-abyss font-semibold text-[14px] px-5 py-[11px] rounded-[10px]"
        >
          + New post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-deep border border-[var(--line)] rounded-[16px] p-12 text-center">
          <h2 className="font-display font-medium text-[20px] m-0 mb-2">
            No posts yet
          </h2>
          <p className="text-[14px] text-[var(--foam-soft)] m-0 mb-6">
            Write your first story — it&apos;ll be SEO-ready the moment you publish.
          </p>
          <Link
            href="/admin/posts/new"
            className="inline-block bg-coral hover:bg-coral-soft text-abyss font-semibold text-[14px] px-5 py-[11px] rounded-[10px]"
          >
            Write your first post
          </Link>
        </div>
      ) : (
        <PostList posts={posts} />
      )}
    </div>
  );
}
