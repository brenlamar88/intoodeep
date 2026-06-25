import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";

/**
 * Data-access helpers for posts. These tolerate a missing/unconfigured
 * database (returning empty results) so the site still renders before the
 * Supabase project is wired up.
 */

export async function getPublishedPosts(limit?: number): Promise<Post[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });
    if (limit) query = query.limit(limit);
    const { data, error } = await query;
    if (error) return [];
    return (data as Post[]) ?? [];
  } catch {
    return [];
  }
}

export async function getPublishedPostBySlug(
  slug: string
): Promise<Post | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    if (error) return null;
    return (data as Post) ?? null;
  } catch {
    return null;
  }
}

export async function getPublishedSlugs(): Promise<
  { slug: string; updated_at: string }[]
> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select("slug, updated_at")
      .eq("status", "published");
    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}
