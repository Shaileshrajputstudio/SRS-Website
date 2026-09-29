import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
dotenv.config({ path: ".env.local" });

const APPLY = process.argv.includes("--apply");
const SRC_DIR = process.argv[2];
if (!SRC_DIR || SRC_DIR.startsWith("--")) {
  console.error("Usage: node scripts/import-photos.mjs <resized-photos-dir> [--apply]");
  process.exit(1);
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);
const MEDIA_PREFIX = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/`;

function norm(s) {
  return s.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

// Sorts by the trailing _N in the filename (Seepi_1.jpg, Seepi_2.jpg, ...)
// so gallery order matches the numbering the client shot them in.
function photoIndex(filename) {
  const m = filename.match(/_(\d+)\.[a-z]+$/i);
  return m ? parseInt(m[1], 10) : 999;
}

const { data: live, error } = await supabase.from("products").select("id,slug,display_name,images,placeholder");
if (error) throw error;
const liveByNorm = new Map(live.map((p) => [norm(p.display_name), p]));

const folders = fs.readdirSync(SRC_DIR).filter((f) => fs.statSync(path.join(SRC_DIR, f)).isDirectory());

console.log(`${APPLY ? "APPLYING" : "DRY RUN"} — ${folders.length} product folders from ${SRC_DIR}\n`);

let succeeded = 0;
let unmatched = [];

for (const folder of folders) {
  const liveP = liveByNorm.get(norm(folder));
  if (!liveP) {
    unmatched.push(folder);
    continue;
  }

  const dir = path.join(SRC_DIR, folder);
  const files = fs
    .readdirSync(dir)
    .filter((f) => /\.(jpg|jpeg|png)$/i.test(f))
    .sort((a, b) => photoIndex(a) - photoIndex(b));

  if (files.length === 0) {
    console.log(`${folder}: no photos found, skipping`);
    continue;
  }

  console.log(`${liveP.display_name} (${liveP.slug}) <- ${folder}: ${files.length} photos`);

  if (!APPLY) {
    succeeded++;
    continue;
  }

  const newUrls = [];
  for (const file of files) {
    const buffer = fs.readFileSync(path.join(dir, file));
    const safeName = file.replace(/[^a-zA-Z0-9._-]/g, "-");
    const objectPath = `products/${crypto.randomUUID()}-${safeName}`;
    const { error: upErr } = await supabase.storage
      .from("media")
      .upload(objectPath, buffer, { contentType: "image/jpeg" });
    if (upErr) {
      console.error(`  FAILED upload ${file}: ${upErr.message}`);
      continue;
    }
    const { data: pub } = supabase.storage.from("media").getPublicUrl(objectPath);
    newUrls.push(pub.publicUrl);
  }

  if (newUrls.length === 0) {
    console.error(`  No photos uploaded for ${folder}, leaving existing images untouched.`);
    continue;
  }

  const oldUrls = liveP.images ?? [];
  const updatePayload = { images: newUrls };
  if (liveP.placeholder) updatePayload.placeholder = false;

  const { error: updErr } = await supabase.from("products").update(updatePayload).eq("id", liveP.id);
  if (updErr) {
    console.error(`  FAILED db update: ${updErr.message}`);
    continue;
  }

  const toDelete = oldUrls.filter((u) => u && u.startsWith(MEDIA_PREFIX)).map((u) => u.slice(MEDIA_PREFIX.length));
  if (toDelete.length > 0) {
    const { error: delErr } = await supabase.storage.from("media").remove(toDelete);
    if (delErr) console.error(`  cleanup failed: ${delErr.message}`);
  }

  succeeded++;
}

console.log(`\n${APPLY ? "Updated" : "Would update"}: ${succeeded} / ${folders.length}`);
if (unmatched.length > 0) {
  console.log(`Unmatched folders (no live product found): ${unmatched.join(", ")}`);
}
