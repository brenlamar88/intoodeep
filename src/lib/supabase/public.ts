import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cookie-free Supabase client for reading public (published) content.
 *
 * Public pages (blog index, post pages, sitemap, RSS) only read published
 * rows, which RLS exposes to the anon role. Using a client that never touches
 * request cookies keeps these pages statically renderable / cacheable instead
 * of being forced dynamic.
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
