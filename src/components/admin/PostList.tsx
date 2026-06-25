import Link from "next/link";
import { Pencil, ExternalLink } from "lucide-react";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function PostList({ posts }: { posts: Post[] }) {
  return (
    <div className="bg-deep border border-[var(--line)] rounded-[16px] overflow-hidden divide-y divide-[var(--line)]">
      {posts.map((post) => (
        <div
          key={post.id}
          className="group relative flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4 hover:bg-[rgba(234,244,243,0.03)] transition-colors"
        >
          {/* Title + meta — the whole block links to the editor */}
          <Link
            href={`/admin/posts/${post.id}`}
            className="min-w-0 flex-1 focus:outline-none"
          >
            <div className="font-medium text-[15px] truncate group-hover:text-surface-soft transition-colors">
              {post.title || "Untitled"}
            </div>
            <div className="text-[12.5px] text-[var(--foam-soft)] mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="truncate">/blog/{post.slug}</span>
              {post.category && (
                <>
                  <span aria-hidden>·</span>
                  <span>{post.category}</span>
                </>
              )}
              <span aria-hidden>·</span>
              <span>Updated {formatDate(post.updated_at)}</span>
            </div>
          </Link>

          {/* Status + actions */}
          <div className="flex items-center gap-2 shrink-0">
            <StatusPill status={post.status} />
            <Link
              href={`/admin/posts/${post.id}`}
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-foam bg-[rgba(234,244,243,0.05)] hover:bg-[rgba(234,244,243,0.1)] border border-[var(--line-strong)] px-3 py-[7px] rounded-[9px] transition-colors"
            >
              <Pencil size={13} /> Edit
            </Link>
            {post.status === "published" && (
              <Link
                href={`/blog/${post.slug}`}
                target="_blank"
                className="hidden sm:inline-flex items-center gap-1.5 text-[13px] text-[var(--foam-soft)] hover:text-foam px-2 py-[7px] rounded-[9px] transition-colors"
                title="View live post"
              >
                <ExternalLink size={13} /> View
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const published = status === "published";
  return (
    <span
      className="inline-flex items-center gap-[6px] text-[12px] font-semibold px-[10px] py-[4px] rounded-full shrink-0"
      style={{
        color: published ? "var(--surface)" : "var(--coral-soft)",
        background: published ? "rgba(95,201,201,0.12)" : "rgba(255,127,99,0.12)",
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
