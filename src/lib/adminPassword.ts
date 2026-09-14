import "server-only";
import { supabaseAdmin } from "./supabaseAdmin";

// The admin login password, stored in the admin_settings table instead of
// a fixed environment variable — so the studio can change it themselves
// (via "Change password" in the admin) without a developer editing env
// vars and redeploying. Same idea as the SRS Catalogue project's R2-blob
// password, just backed by this project's own database instead.
//
// Deliberately NOT read on every request: middleware.ts (which runs on
// nearly every /admin request) just compares the session cookie against
// process.env.ADMIN_PASSWORD — that env var's job is a fixed,
// never-changing session-signing secret, decoupled from the actual login
// password below. Only login/forgot/reset/change-password ever touch
// this table.
export async function getAdminPassword(): Promise<string> {
  const { data, error } = await supabaseAdmin
    .from("admin_settings")
    .select("value")
    .eq("key", "admin_password")
    .maybeSingle();

  if (error) {
    console.error("getAdminPassword: falling back to ADMIN_PASSWORD env var", error);
    return process.env.ADMIN_PASSWORD ?? "";
  }
  return data?.value ?? process.env.ADMIN_PASSWORD ?? "";
}

export async function setAdminPassword(newPassword: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from("admin_settings")
    .upsert({ key: "admin_password", value: newPassword });
  if (error) throw error;
}
