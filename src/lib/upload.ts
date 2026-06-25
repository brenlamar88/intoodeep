import { createClient } from "@/lib/supabase/client";

/**
 * Uploads an image to the public `post-images` Supabase Storage bucket and
 * returns its public URL. Used by the editor and cover-image picker.
 */
export async function uploadImage(file: File): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safe = `${Date.now()}-${Math.round(Math.random() * 1e6)}.${ext}`;
  const path = `uploads/${safe}`;

  const { error } = await supabase.storage
    .from("post-images")
    .upload(path, file, { cacheControl: "31536000", upsert: false });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("post-images").getPublicUrl(path);
  return data.publicUrl;
}
