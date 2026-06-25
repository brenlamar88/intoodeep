import Link from "next/link";
import type { Post } from "@/lib/types";
import { htmlToText } from "@/lib/utils";

const GRADIENTS = [
  "linear-gradient(150deg,#14384a,#5fc9c9)",
  "linear-gradient(150deg,#173f3a,#ff7f63)",
  "linear-gradient(150deg,#1c3550,#8fdede)",
];

export function StoryCard({ post, index = 0 }: { post: Post; index?: number }) {
  const excerpt = post.excerpt || htmlToText(post.content_html, 130);
  return (
    <article className="bg-deep border border-[var(--line)] rounded-[16px] overflow-hidden flex flex-col transition-colors hover:border-[var(--line-strong)]">
      <Link href={`/blog/${post.slug}`} className="block">
        {post.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_image_url}
            alt={post.cover_image_alt || post.title}
            className="h-[140px] w-full object-cover"
          />
        ) : (
          <div
            className="h-[140px]"
            style={{ background: GRADIENTS[index % GRADIENTS.length] }}
          />
        )}
      </Link>
      <div className="p-5 pb-[22px] flex flex-col flex-1">
        {post.category && (
          <span className="self-start text-[11px] tracking-[1.2px] uppercase font-semibold text-surface-soft bg-[rgba(95,201,201,0.12)] px-[11px] py-[5px] rounded-full mb-[14px]">
            {post.category}
          </span>
        )}
        <h3 className="font-display font-medium text-[19px] leading-[1.28] m-0 mb-[10px]">
          <Link href={`/blog/${post.slug}`} className="hover:text-surface-soft">
            {post.title}
          </Link>
        </h3>
        <p className="text-[14px] text-[var(--foam-soft)] m-0 mb-[18px] flex-1">
          {excerpt}
        </p>
        <div className="text-[12.5px] text-[var(--foam-soft)] flex gap-[9px] items-center">
          {post.read_minutes ?? 5} min read
        </div>
      </div>
    </article>
  );
}
