import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/utils";

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
        <div className="bg-deep border border-[var(--line)] rounded-[16px] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[12px] uppercase tracking-[1px] text-[var(--foam-soft)]">
                <th className="font-semibold px-5 py-3">Title</th>
                <th className="font-semibold px-5 py-3 hidden sm:table-cell">Category</th>
                <th className="font-semibold px-5 py-3">Status</th>
                <th className="font-semibold px-5 py-3 hidden md:table-cell">Updated</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="border-t border-[var(--line)] hover:bg-[rgba(234,244,243,0.03)]"
                >
                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="font-medium hover:text-surface-soft"
                    >
                      {post.title}
                    </Link>
                    <div className="text-[12px] text-[var(--foam-soft)] mt-1">
                      /blog/{post.slug}
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell text-[13px] text-[var(--foam-soft)]">
                    {post.category || "—"}
                  </td>
                  <td className="px-5 py-4">
                    <StatusPill status={post.status} />
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell text-[13px] text-[var(--foam-soft)]">
                    {formatDate(post.updated_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const published = status === "published";
  return (
    <span
      className="inline-flex items-center gap-[6px] text-[12px] font-semibold px-[10px] py-[4px] rounded-full"
      style={{
        color: published ? "var(--surface)" : "var(--coral-soft)",
        background: published
          ? "rgba(95,201,201,0.12)"
          : "rgba(255,127,99,0.12)",
      }}
    >
      <span
        className="w-[7px] h-[7px] rounded-full"
        style={{ background: published ? "var(--surface)" : "var(--coral)" }}
      />
      {published ? "Published" : "Draft"}
    </span>
  );
}
