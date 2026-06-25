"use client";

import { Check, X, AlertTriangle } from "lucide-react";
import { htmlToText } from "@/lib/utils";

interface Fields {
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  contentHtml: string;
  coverImageUrl: string;
  coverImageAlt: string;
  category: string;
}

type Level = "pass" | "warn" | "fail";

function check(condition: boolean, warnCondition?: boolean): Level {
  if (condition) return "pass";
  if (warnCondition) return "warn";
  return "fail";
}

export function SeoChecklist({ f }: { f: Fields }) {
  const effectiveTitle = f.metaTitle || f.title;
  const titleLen = effectiveTitle.length;
  const descLen = (f.metaDescription || f.excerpt).length;
  const words = htmlToText(f.contentHtml).split(/\s+/).filter(Boolean).length;

  const items: { level: Level; label: string }[] = [
    {
      level: check(titleLen >= 15 && titleLen <= 60, titleLen > 0),
      label:
        titleLen === 0
          ? "Add a title"
          : `Title length ${titleLen} chars (aim 15–60)`,
    },
    {
      level: check(descLen >= 70 && descLen <= 160, descLen > 0),
      label:
        descLen === 0
          ? "Add a meta description or excerpt"
          : `Description ${descLen} chars (aim 70–160)`,
    },
    {
      level: check(/^[a-z0-9-]+$/.test(f.slug) && f.slug.length > 0),
      label: f.slug ? `URL slug: /blog/${f.slug}` : "Add a URL slug",
    },
    {
      level: check(words >= 300, words > 0),
      label: `${words} words of content (aim 300+)`,
    },
    {
      level: check(!!f.coverImageUrl),
      label: f.coverImageUrl
        ? "Cover image set (used for social sharing)"
        : "Add a cover image for rich social previews",
    },
    {
      level: check(!f.coverImageUrl || !!f.coverImageAlt, !f.coverImageUrl),
      label: f.coverImageAlt
        ? "Cover image has alt text"
        : "Add alt text to the cover image",
    },
    {
      level: check(!!f.category),
      label: f.category ? `Category: ${f.category}` : "Choose a category",
    },
    {
      level: check(/<h[23]/.test(f.contentHtml), words > 0),
      label: /<h[23]/.test(f.contentHtml)
        ? "Uses subheadings (good for skimming & SEO)"
        : "Break content up with subheadings (H2/H3)",
    },
  ];

  const passed = items.filter((i) => i.level === "pass").length;
  const score = Math.round((passed / items.length) * 100);
  const scoreColor =
    score >= 80 ? "var(--surface)" : score >= 50 ? "#f4c95d" : "var(--coral)";

  return (
    <div className="bg-deep border border-[var(--line)] rounded-[14px] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-medium text-[16px] m-0">SEO readiness</h3>
        <span className="font-semibold text-[15px]" style={{ color: scoreColor }}>
          {score}%
        </span>
      </div>
      <div className="h-[6px] rounded-full bg-[rgba(234,244,243,0.08)] mb-5 overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: scoreColor }} />
      </div>
      <ul className="space-y-[10px] m-0 p-0 list-none">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-[10px] text-[13px]">
            <Icon level={item.level} />
            <span className={item.level === "fail" ? "text-[var(--foam-soft)]" : "text-foam"}>
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Icon({ level }: { level: Level }) {
  if (level === "pass")
    return <Check size={15} className="mt-[2px] shrink-0" style={{ color: "var(--surface)" }} />;
  if (level === "warn")
    return <AlertTriangle size={14} className="mt-[2px] shrink-0" style={{ color: "#f4c95d" }} />;
  return <X size={15} className="mt-[2px] shrink-0" style={{ color: "var(--coral)" }} />;
}
