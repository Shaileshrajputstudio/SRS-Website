import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config({ path: ".env.local" });

const APPLY = process.argv.includes("--apply");

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);
const master = JSON.parse(fs.readFileSync("/tmp/master-products.json", "utf-8"));

const NEW_NAMES = new Set([
  "SAMBHU MINI", "SAMBHU TEXTURED MINI", "JHO:LA", "SEE:TA", "UD:BHAV", "LE:HAR",
  "NIR:VANA", "AA:KAR", "AA:VARTAN", "AA:STHA", "LEE:LA", "AA:ROHA", "DA:RICHA (A)",
  "VAL:MIKA", "VY:AL", "VA:LIN", "SAM:YA", "A:KS",
]);

const CATEGORY_MAP = {
  "Accent Furniture Pieces": "Accent Furniture Products",
  "Artisanal Pieces": "Artisanal Products",
};
const SERIES_MAP = {
  Bhoomi: "Bhumi",
  Samayantar: "Sama:Yantar",
  "Parth Sarathi": "Parth:Sarathi",
  "Prem Samatva": "Prem:Samatva",
};

function normSeries(katha) {
  if (!katha || katha === "NA") return "—";
  const s = katha.trim().replace(/\s*-\s*Panch Bhuta$/i, "");
  return SERIES_MAP[s] ?? s;
}

function slugify(name) {
  return name
    .replace(/[():]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseSize(size) {
  const out = { height: "—", width: "—", depth: "—" };
  if (!size) return out;
  const clean = size.replace(/[“”″]/g, '"');
  for (const part of clean.split("|")) {
    const m = part.match(/(Height|Width|Depth)\s*:\s*([^|]+)/i);
    if (m) out[m[1].toLowerCase()] = m[2].trim();
  }
  return out;
}

function fixMaterial(material) {
  if (!material) return "—";
  return material.replace(/\bBlow Glass\b/g, "Blown Glass").trim();
}

// ProductCategoryBrowser renders `<Image src={product.images[0]}>` with
// no fallback — an empty images array throws at runtime. The site already
// ships one placeholder SVG per category for exactly this case.
function placeholderImage(category) {
  const slug = category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return [`/images/products/placeholder/${slug}-1.svg`];
}

function splitDescription(description) {
  const parts = (description || "").split(/\n\n+/).map((s) => s.trim()).filter(Boolean);
  if (parts.length <= 1) return { about: parts, closing: [] };
  return { about: parts.slice(0, -1), closing: [parts[parts.length - 1]] };
}

const { data: maxRow, error: maxErr } = await supabase
  .from("products")
  .select("sort_order")
  .order("sort_order", { ascending: false })
  .limit(1)
  .maybeSingle();
if (maxErr) throw maxErr;
let nextSort = (maxRow?.sort_order ?? -1) + 1;

const rows = master.filter((r) => NEW_NAMES.has(r.name));
console.log(`${APPLY ? "APPLYING" : "DRY RUN"} — ${rows.length} new products\n`);

let created = 0;
for (const row of rows) {
  const { about, closing } = splitDescription(row.description);
  const dims = parseSize(row.size);
  const category = CATEGORY_MAP[row.category] ?? row.category;
  const payload = {
    slug: slugify(row.name),
    display_name: row.name,
    romanized: row.name,
    series: normSeries(row.katha),
    category,
    placeholder: true, // no real photography yet — swap in once photos land
    about,
    closing,
    product_code: row.product_code || "—",
    material: fixMaterial(row.material),
    dim_height: dims.height,
    dim_width: dims.width,
    dim_depth: dims.depth,
    weight: row.weight || "—",
    lighting_spec: row.lighting_spec || "—",
    images: placeholderImage(category),
    sort_order: nextSort++,
  };

  console.log(`${payload.slug.padEnd(20)} series="${payload.series}" category="${payload.category}"`);

  if (APPLY) {
    const { error: insErr } = await supabase.from("products").insert(payload);
    if (insErr) {
      console.error(`  FAILED: ${insErr.message}`);
      continue;
    }
  }
  created++;
}

console.log(`\n${APPLY ? "Created" : "Would create"}: ${created} / ${rows.length}`);
