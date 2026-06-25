import { createClient } from "@/lib/supabase/server";
import type { Author } from "@/lib/types";

/**
 * Returns the current author record if the logged-in user is an approved
 * writer, otherwise null. Approval = a row in `authors` matching their email.
 */
export async function getCurrentAuthor(): Promise<Author | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) return null;

    const { data } = await supabase
      .from("authors")
      .select("*")
      .ilike("email", user.email)
      .maybeSingle();

    return (data as Author) ?? null;
  } catch {
    return null;
  }
}
