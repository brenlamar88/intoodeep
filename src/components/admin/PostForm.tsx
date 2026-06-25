"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "@/components/admin/Editor";
import { SeoChecklist } from "@/components/admin/SeoChecklist";
import { savePost, deletePost, type PostInput } from "@/app/admin/actions";
import { CATEGORIES, type Post, type PostStatus } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { uploadImage } from "@/lib/upload";
import { getSiteUrlClient } from "@/lib/site-client";

export function PostForm({ post }: { post?: Post }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!post);
  const [category, setCategory] = useState(post?.category ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [contentHtml, setContentHtml] = useState(post?.content_html ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(post?.cover_image_url ?? "");
  const [coverImageAlt, setCoverImageAlt] = useState(post?.cover_image_alt ?? "");
  const [tags, setTags] = useState((post?.tags ?? []).join(", "));
  const [metaTitle, setMetaTitle] = useState(post?.meta_title ?? "");
  const [metaDescription, setMetaDescription] = useState(post?.meta_description ?? "");
  const [ogImageUrl, setOgImageUrl] = useState(post?.og_image_url ?? "");
  const [canonicalUrl, setCanonicalUrl] = useState(post?.canonical_url ?? "");
  const [noindex, setNoindex] = useState(post?.noindex ?? false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const effectiveSlug = slug || slugify(title);

  function onTitleChange(v: string) {
    setTitle(v);
    if (!slugTouched) setSlug(slugify(v));
  }

  function build(status: PostStatus): PostInput {
    return {
      id: post?.id,
      title, slug: effectiveSlug, excerpt, content_html: contentHtml,
      cover_image_url: coverImageUrl, cover_image_alt: coverImageAlt,
      category, tags, status,
      meta_title: metaTitle, meta_description: metaDescription,
      og_image_url: ogImageUrl, canonical_url: canonicalUrl, noindex,
    };
  }

  function submit(status: PostStatus) {
    setError("");
    startTransition(async () => {
      const res = await savePost(build(status));
      if (!res.ok) {
        setError(res.error || "Something went wrong.");
        return;
      }
      router.push("/admin");
      router.refresh();
    });
  }

  function onDelete() {
    if (!post) return;
    if (!confirm("Delete this post permanently? This cannot be undone.")) return;
    startTransition(async () => {
      const res = await deletePost(post.id);
      if (res && !res.ok) setError(res.error || "Delete failed.");
    });
  }

  async function onCoverPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const url = await uploadImage(file);
      setCoverImageUrl(url);
    } catch (err) {
      setError("Cover upload failed: " + (err as Error).message);
    } finally {
      setUploadingCover(false);
    }
  }

  const previewTitle = metaTitle || title || "Your post title";
  const previewDesc = metaDescription || excerpt || "Your meta description will appear here.";
  const previewUrl = `${getSiteUrlClient()}/blog/${effectiveSlug || "your-post"}`;

  const seoFields = useMemo(
    () => ({
      title, slug: effectiveSlug, metaTitle, metaDescription, excerpt,
      contentHtml, coverImageUrl, coverImageAlt, category,
    }),
    [title, effectiveSlug, metaTitle, metaDescription, excerpt, contentHtml, coverImageUrl, coverImageAlt, category]
  );

  return (
    <div className="pb-4">
      {/* STICKY ACTION BAR */}
      <div className="sticky top-0 z-30 -mx-4 sm:-mx-6 lg:-mx-8 mb-7 sm:mb-9 border-b border-[var(--line)] bg-[rgba(9,30,40,0.82)] backdrop-blur-md">
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="font-display font-medium text-[19px] sm:text-[22px] m-0 truncate">
              {post ? "Edit post" : "New post"}
            </h1>
            {post && <StatusPill status={post.status} />}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => submit("draft")} disabled={isPending}
              className="bg-deep border border-[var(--line-strong)] hover:border-foam text-foam font-medium text-[13.5px] sm:text-[14px] px-3.5 sm:px-5 py-2.5 rounded-[10px] cursor-pointer disabled:opacity-60 transition-colors">
              Save<span className="hidden sm:inline"> draft</span>
            </button>
            <button onClick={() => submit("published")} disabled={isPending}
              className="bg-coral hover:bg-coral-soft text-abyss font-semibold text-[13.5px] sm:text-[14px] px-4 sm:px-5 py-2.5 rounded-[10px] cursor-pointer disabled:opacity-60 transition-colors">
              {isPending ? "Saving…" : post?.status === "published" ? "Update" : "Publish"}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 text-[14px] text-coral-soft bg-[rgba(255,127,99,0.1)] border border-[rgba(255,127,99,0.3)] rounded-[10px] px-4 py-3">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6 lg:gap-8 xl:gap-10 items-start">
        {/* MAIN COLUMN */}
        <div className="space-y-6 sm:space-y-7 min-w-0">
          <div className="space-y-3">
            <input
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Post title"
              className="w-full bg-transparent border-0 border-b border-[var(--line)] focus:border-coral outline-none font-display font-medium text-[26px] sm:text-[30px] leading-tight py-2.5 placeholder:text-[var(--foam-soft)]"
            />

            <div className="flex items-stretch rounded-[10px] border border-[var(--line)] focus-within:border-coral bg-deep overflow-hidden">
              <span className="flex items-center pl-3.5 pr-1 text-[12.5px] text-[var(--foam-soft)] whitespace-nowrap select-none">
                <span className="hidden md:inline">{getSiteUrlClient()}</span>/blog/
              </span>
              <input
                value={slug}
                onChange={(e) => { setSlug(slugify(e.target.value)); setSlugTouched(true); }}
                placeholder="url-slug"
                className="flex-1 min-w-0 bg-transparent outline-none pr-3.5 md:pl-0 pl-1 py-[10px] text-[13px] text-foam placeholder:text-[var(--foam-soft)]"
              />
            </div>
          </div>

          <RichTextEditor value={contentHtml} onChange={setContentHtml} />

          <Field label="Excerpt" hint="A 1–2 sentence summary shown on cards & in search results. Leave blank to auto-generate.">
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              maxLength={200}
              placeholder="On letting yourself go under for a minute — and why hiding it isn't always the kindness we think it is."
              className="w-full bg-deep border border-[var(--line)] focus:border-coral outline-none rounded-[10px] px-4 py-3 text-[14px] text-foam resize-y placeholder:text-[var(--foam-soft)] leading-relaxed"
            />
          </Field>

          {post && (
            <div className="pt-5 border-t border-[var(--line)]">
              <button onClick={onDelete} disabled={isPending}
                className="text-[13.5px] text-[var(--foam-soft)] hover:text-coral-soft cursor-pointer disabled:opacity-60 transition-colors">
                Delete this post
              </button>
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="space-y-5 sm:space-y-6">
          <SeoChecklist f={seoFields} />

          {/* Google preview */}
          <div className="bg-deep border border-[var(--line)] rounded-[14px] p-5 sm:p-6">
            <h3 className="font-display font-medium text-[15px] m-0 mb-4">Search preview</h3>
            <div className="bg-white rounded-[8px] p-3.5">
              <div className="text-[#202124] text-[12px] truncate">{previewUrl}</div>
              <div className="text-[#1a0dab] text-[16px] leading-tight truncate mt-0.5">{previewTitle}</div>
              <div className="text-[#4d5156] text-[12.5px] leading-snug line-clamp-2 mt-1">{previewDesc}</div>
            </div>
          </div>

          <Panel title="Category">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-deep border border-[var(--line)] focus:border-coral outline-none rounded-[10px] px-3 py-[10px] text-[14px] text-foam"
            >
              <option value="">— Choose —</option>
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.label}>{c.label}</option>
              ))}
            </select>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Tags, comma separated"
              className="w-full mt-3 bg-deep border border-[var(--line)] focus:border-coral outline-none rounded-[10px] px-3 py-[10px] text-[14px] text-foam placeholder:text-[var(--foam-soft)]"
            />
          </Panel>

          <Panel title="Cover image">
            {coverImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverImageUrl} alt={coverImageAlt} className="w-full rounded-[10px] border border-[var(--line)] mb-3" />
            ) : (
              <div className="w-full h-[120px] rounded-[10px] border border-dashed border-[var(--line-strong)] flex items-center justify-center text-[13px] text-[var(--foam-soft)] mb-3">
                No cover image
              </div>
            )}
            <label className="block">
              <span className="inline-block bg-deep border border-[var(--line-strong)] hover:border-foam text-[13px] px-3 py-[8px] rounded-[8px] cursor-pointer mb-3">
                {uploadingCover ? "Uploading…" : "Upload image"}
              </span>
              <input type="file" accept="image/*" hidden onChange={onCoverPick} />
            </label>
            <input
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              placeholder="…or paste an image URL"
              className="w-full bg-deep border border-[var(--line)] focus:border-coral outline-none rounded-[10px] px-3 py-[9px] text-[13px] text-foam mb-2 placeholder:text-[var(--foam-soft)]"
            />
            <input
              value={coverImageAlt}
              onChange={(e) => setCoverImageAlt(e.target.value)}
              placeholder="Alt text (describe the image)"
              className="w-full bg-deep border border-[var(--line)] focus:border-coral outline-none rounded-[10px] px-3 py-[9px] text-[13px] text-foam placeholder:text-[var(--foam-soft)]"
            />
          </Panel>

          <Panel title="Advanced SEO">
            <SmallField label="Meta title" hint="Overrides the title in search results & browser tabs.">
              <input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)}
                placeholder={title || "Defaults to the post title"}
                className="w-full bg-deep border border-[var(--line)] focus:border-coral outline-none rounded-[10px] px-3 py-[9px] text-[13px] text-foam placeholder:text-[var(--foam-soft)]" />
            </SmallField>
            <SmallField label="Meta description" hint="Overrides the excerpt in search results.">
              <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={2} maxLength={170}
                className="w-full bg-deep border border-[var(--line)] focus:border-coral outline-none rounded-[10px] px-3 py-[9px] text-[13px] text-foam resize-y" />
            </SmallField>
            <SmallField label="Social share image (OG)" hint="Defaults to the cover image.">
              <input value={ogImageUrl} onChange={(e) => setOgImageUrl(e.target.value)}
                placeholder="https://…"
                className="w-full bg-deep border border-[var(--line)] focus:border-coral outline-none rounded-[10px] px-3 py-[9px] text-[13px] text-foam placeholder:text-[var(--foam-soft)]" />
            </SmallField>
            <SmallField label="Canonical URL" hint="Use if this content lives elsewhere too.">
              <input value={canonicalUrl} onChange={(e) => setCanonicalUrl(e.target.value)}
                placeholder="Leave blank for default"
                className="w-full bg-deep border border-[var(--line)] focus:border-coral outline-none rounded-[10px] px-3 py-[9px] text-[13px] text-foam placeholder:text-[var(--foam-soft)]" />
            </SmallField>
            <label className="flex items-center gap-[10px] text-[13px] text-foam mt-3 cursor-pointer">
              <input type="checkbox" checked={noindex} onChange={(e) => setNoindex(e.target.checked)} className="accent-[var(--coral)]" />
              Hide from search engines (noindex)
            </label>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: PostStatus }) {
  const published = status === "published";
  return (
    <span
      className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.6px] px-2.5 py-1 rounded-full shrink-0"
      style={{
        color: published ? "var(--surface)" : "var(--foam-soft)",
        background: published ? "rgba(95,201,201,0.12)" : "rgba(234,244,243,0.07)",
      }}
    >
      <span
        className="w-[6px] h-[6px] rounded-full"
        style={{ background: published ? "var(--surface)" : "var(--foam-soft)" }}
      />
      {published ? "Published" : "Draft"}
    </span>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[14px] font-medium mb-1.5">{label}</label>
      {hint && <p className="text-[12.5px] text-[var(--foam-soft)] m-0 mb-2.5 leading-relaxed">{hint}</p>}
      {children}
    </div>
  );
}

function SmallField({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 last:mb-0">
      <label className="block text-[12.5px] font-medium mb-1">{label}</label>
      {hint && <p className="text-[11.5px] text-[var(--foam-soft)] m-0 mb-2 leading-relaxed">{hint}</p>}
      {children}
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-deep border border-[var(--line)] rounded-[14px] p-5 sm:p-6">
      <h3 className="font-display font-medium text-[15px] m-0 mb-4">{title}</h3>
      {children}
    </div>
  );
}
