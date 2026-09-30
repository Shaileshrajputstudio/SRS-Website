import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
dotenv.config({ path: ".env.local" });

const APPLY = process.argv.includes("--apply");
const SRC_DIRS = process.argv.slice(2).filter((a) => !a.startsWith("--"));
if (SRC_DIRS.length === 0) {
  console.error("Usage: node scripts/migrate-photos-to-static.mjs <resized-photos-dir>... [--apply]");
  process.exit(1);
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);
const MEDIA_PREFIX = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/`;
const PUBLIC_DIR = path.join(process.cwd(), "public", "images", "products");

function norm(s) {
  return s.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function photoIndex(filename) {
  const m = filename.match(/_(\d+)\.[a-z]+$/i);
  return m ? parseInt(m[1], 10) : 999;
}

const { data: live, error } = await supabase.from("products").select("id,slug,display_name,images,placeholder");
if (error) throw error;
const liveByNorm = new Map(live.map((p) => [norm(p.display_name), p]));

console.log(`${APPLY ? "APPLYING" : "DRY RUN"}\n`);

let done = 0;
const allToDeleteFromStorage = [];

for (const srcDir of SRC_DIRS) {
  const folders = fs.readdirSync(srcDir).filter((f) => fs.statSync(path.join(srcDir, f)).isDirectory());

  for (const folder of folders) {
    const liveP = liveByNorm.get(norm(folder));
    if (!liveP) {
      console.log(`SKIP (no live match): ${folder}`);
      continue;
    }

    const dir = path.join(srcDir, folder);
    const files = fs
      .readdirSync(dir)
      .filter((f) => /\.(jpg|jpeg|png)$/i.test(f))
      .sort((a, b) => photoIndex(a) - photoIndex(b));

    if (files.length === 0) continue;

    const destDir = path.join(PUBLIC_DIR, liveP.slug);
    const newPaths = files.map((_, i) => `/images/products/${liveP.slug}/${i + 1}.jpg`);

    console.log(`${liveP.display_name} (${liveP.slug}): ${files.length} photos -> ${destDir}`);

    // Any old Supabase-hosted URLs on this product get cleaned up after
    // the DB is repointed to the new static paths.
    const oldMediaUrls = (liveP.images ?? []).filter((u) => u && u.startsWith(MEDIA_PREFIX));
    allToDeleteFromStorage.push(...oldMediaUrls.map((u) => u.slice(MEDIA_PREFIX.length)));

    if (!APPLY) {
      done++;
      continue;
    }

    fs.mkdirSync(destDir, { recursive: true });
    files.forEach((file, i) => {
      fs.copyFileSync(path.join(dir, file), path.join(destDir, `${i + 1}.jpg`));
    });

    const updatePayload = { images: newPaths };
    if (liveP.placeholder) updatePayload.placeholder = false;
    const { error: updErr } = await supabase.from("products").update(updatePayload).eq("id", liveP.id);
    if (updErr) {
      console.error(`  FAILED db update: ${updErr.message}`);
      continue;
    }
    done++;
  }
}

console.log(`\n${APPLY ? "Migrated" : "Would migrate"}: ${done}`);

if (APPLY && allToDeleteFromStorage.length > 0) {
  console.log(`Cleaning up ${allToDeleteFromStorage.length} orphaned Supabase Storage objects...`);
  const { error: delErr } = await supabase.storage.from("media").remove(allToDeleteFromStorage);
  if (delErr) console.error(`  cleanup failed: ${delErr.message}`);
  else console.log("  done.");
} else if (allToDeleteFromStorage.length > 0) {
  console.log(`Would delete ${allToDeleteFromStorage.length} orphaned Supabase Storage objects.`);
}
