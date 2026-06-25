"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAuthor } from "@/lib/auth";
import { slugify, readingMinutes, htmlToText } from "@/lib/utils";
import type { PostStatus } from "@/lib/types";

export interface PostInput {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content_html: string;
  cover_image_url: string;
  cover_image_alt: string;
  category: string;
  tags: string;
  status: PostStatus;
  meta_title: string;
  meta_description: string;
  og_image_url: string;
  canonical_url: string;
  noindex: boolean;
}

export interface ActionResult {
  ok: boolean;
  error?: string;
  id?: string;
}

export async function savePost(input: PostInput): Promise<ActionResult> {
  const author = await getCurrentAuthor();
  if (!author) return { ok: false, error: "Not authorized." };

  const supabase = await createClient();

  const title = input.title.trim();
  if (!title) return { ok: false, error: "A title is required." };

  const slug = (input.slug.trim() ? slugify(input.slug) : slugify(title)) || `post-${Date.now()}`;
  const tags = input.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const row = {
    title,
    slug,
    excerpt: input.excerpt.trim() || htmlToText(input.content_html, 160),
    content_html: input.content_html,
    cover_image_url: input.cover_image_url.trim() || null,
    cover_image_alt: input.cover_image_alt.trim() || null,
    category: input.category.trim() || null,
    tags: tags.length ? tags : null,
    read_minutes: readingMinutes(input.content_html),
    status: input.status,
    meta_title: input.meta_title.trim() || null,
    meta_description: input.meta_description.trim() || null,
    og_image_url: input.og_image_url.trim() || null,
    canonical_url: input.canonical_url.trim() || null,
    noindex: input.noindex,
    author_id: author.id,
    author_name: author.name || author.email,
  };

  if (input.id) {
    // Preserve original published_at; set it the first time it goes live.
    const { data: existing } = await supabase
      .from("posts")
      .select("published_at, status")
      .eq("id", input.id)
      .maybeSingle();

    const published_at =
      input.status === "published"
        ? existing?.published_at ?? new Date().toISOString()
        : existing?.published_at ?? null;

    const { error } = await supabase
      .from("posts")
      .update({ ...row, published_at })
      .eq("id", input.id);

    if (error) return { ok: false, error: error.message };
    revalidatePaths(slug);
    return { ok: true, id: input.id };
  }

  const published_at =
    input.status === "published" ? new Date().toISOString() : null;

  const { data, error } = await supabase
    .from("posts")
    .insert({ ...row, published_at })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };
  revalidatePaths(slug);
  return { ok: true, id: data.id };
}

export async function deletePost(id: string): Promise<ActionResult> {
  const author = await getCurrentAuthor();
  if (!author) return { ok: false, error: "Not authorized." };

  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin");
  revalidatePath("/blog");
  revalidatePath("/");
  redirect("/admin");
}

function revalidatePaths(slug: string) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin");
  revalidatePath("/sitemap.xml");
}
