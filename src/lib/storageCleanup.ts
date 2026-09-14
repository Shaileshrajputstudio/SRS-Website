import "server-only";
import { supabaseAdmin } from "./supabaseAdmin";

const MEDIA_PREFIX = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/`;

// Deletes any URL present in `oldUrls` but not in `newUrls` — called from
// every admin save action after a successful update, so replacing or
// removing a photo doesn't silently leave the old file taking up Supabase
// Storage forever. Only ever touches files under our own "media" bucket
// (matched by URL prefix); a static /images/... path baked into the
// site's own code is left alone, since that's not ours to delete here.
// Failures are logged, not thrown — a cleanup miss shouldn't block the
// content change that was actually being saved.
export async function cleanupRemovedImages(
  oldUrls: (string | null | undefined)[],
  newUrls: (string | null | undefined)[],
) {
  const newSet = new Set(newUrls.filter(Boolean));
  const removed = oldUrls.filter((u): u is string => !!u && !newSet.has(u));
  const paths = removed.filter((u) => u.startsWith(MEDIA_PREFIX)).map((u) => u.slice(MEDIA_PREFIX.length));
  if (paths.length === 0) return;

  const { error } = await supabaseAdmin.storage.from("media").remove(paths);
  if (error) console.error("cleanupRemovedImages: failed to delete", paths, error);
}
