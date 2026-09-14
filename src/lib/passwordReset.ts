import "server-only";
import crypto from "crypto";
import { supabaseAdmin } from "./supabaseAdmin";

// A one-time reset token for the "Forgot password" flow, stored the same
// key/value way as the password itself (admin_settings, key
// "reset_token"). Mirrors the SRS Catalogue project's token shape and
// lifecycle: single-use, short-lived, a 256-bit random secret so a leaked
// row alone (behind RLS anyway) doesn't let anyone reset the password —
// they'd still need the token, which is only ever sent by email.
const TOKEN_TTL_MS = 30 * 60 * 1000; // 30 minutes

type ResetToken = { token: string; expiresAt: number };

export async function createResetToken(): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const payload: ResetToken = { token, expiresAt: Date.now() + TOKEN_TTL_MS };
  const { error } = await supabaseAdmin
    .from("admin_settings")
    .upsert({ key: "reset_token", value: JSON.stringify(payload) });
  if (error) throw error;
  return token;
}

export async function verifyResetToken(token: string): Promise<boolean> {
  if (!token) return false;
  const { data, error } = await supabaseAdmin
    .from("admin_settings")
    .select("value")
    .eq("key", "reset_token")
    .maybeSingle();
  if (error || !data?.value) return false;
  try {
    const { token: stored, expiresAt }: ResetToken = JSON.parse(data.value);
    return stored === token && Date.now() < expiresAt;
  } catch {
    return false;
  }
}

// Single-use: called once a token has been successfully redeemed (or to
// invalidate a stale one before issuing a fresh request), so a reset link
// can't be replayed.
export async function clearResetToken(): Promise<void> {
  await supabaseAdmin.from("admin_settings").delete().eq("key", "reset_token");
}
