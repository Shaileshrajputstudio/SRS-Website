"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Issues a short-lived signed upload URL/token so the browser can PUT the
// file bytes straight to Supabase Storage — the server action itself only
// ever handles a filename string, never the file's bytes, so it stays
// well under Vercel's 4.5MB function body limit no matter how large the
// photo is.
export async function createImageUploadUrl(folder: string, filename: string) {
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = `${folder}/${crypto.randomUUID()}-${safeName}`;

  const { data, error } = await supabaseAdmin.storage
    .from("media")
    .createSignedUploadUrl(path);
  if (error) throw error;

  const { data: pub } = supabaseAdmin.storage.from("media").getPublicUrl(path);

  return { path, token: data.token, publicUrl: pub.publicUrl };
}
