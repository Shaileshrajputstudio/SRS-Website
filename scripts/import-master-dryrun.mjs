import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config({ path: ".env.local" });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);
const master = JSON.parse(fs.readFileSync("/tmp/master-products.json", "utf-8"));

const { data: live, error } = await supabase.from("products").select("*").order("sort_order");
if (error) throw error;

// Explicit aliases for names that clearly refer to the same live product
// under a different spelling in the master file — resolved by hand, not
// guessed, since a wrong auto-merge would corrupt a real product.
const ALIASES = {
  "AUṂ": "AUM",
  "E:RAYA MIRROR I": "ERAYA I",
  "E:RAYA MIRROR II": "ERAYA II",
  "E:RAYA MIRROR III": "ERAYA III",
  "E:RAYA MIRROR IV": "ERAYA IV",
  "E:RAYA MIRROR V": "ERAYA V",
  "TI:VRA Bench": "TI:VRA Bench (set of 2)",
  "SURYA NAMASKAR": "SURYA NAMASKAR Wall Clock",
  // Confirmed same product: identical product_code (SRS-FL-13), same
  // category/series, and the master file's own description body refers
  // to it as "MAR:GA" even though the name cell says "MAR:G" — a typo.
  "MAR:G": "MAR:GA",
};

const HOLD_OUT = new Set();

const CATEGORY_MAP = {
  "Accent Furniture Pieces": "Accent Furniture Products",
  "Artisanal Pieces": "Artisanal Products",
};

function normSeries(katha) {
  if (!katha || katha === "NA") return "";
  let s = katha.trim();
  s = s.replace(/\s*-\s*Panch Bhuta$/i, "");
  const map = {
    Bhoomi: "Bhumi",
    Samayantar: "Sama:Yantar",
    "Parth Sarathi": "Parth:Sarathi",
    "Prem Samatva": "Prem:Samatva",
  };
  return map[s] ?? s;
}

function norm(s) {
  return s.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function parseSize(size) {
  if (!size) return { height: "", width: "", depth: "" };
  const out = { height: "", width: "", depth: "" };
  const clean = size.replace(/[“”″]/g, '"');
  for (const part of clean.split("|")) {
    const m = part.match(/(Height|Width|Depth)\s*:\s*([^|]+)/i);
    if (m) out[m[1].toLowerCase()] = m[2].trim();
  }
  return out;
}

// A recurring typo in the client's own sheet ("Blow Glass" -> "Blown
// Glass") — fixed on import rather than carried verbatim, flagged here
// so it's not a silent change.
function fixMaterial(material) {
  if (!material) return material;
  return material.replace(/\bBlow Glass\b/g, "Blown Glass");
}

const liveByNorm = new Map(live.map((p) => [norm(p.display_name), p]));

const matched = [];
const newInMaster = [];
const unresolved = [];

for (const row of master) {
  if (HOLD_OUT.has(row.name)) {
    unresolved.push(row.name);
    continue;
  }
  const targetName = ALIASES[row.name] ?? row.name;
  const liveP = liveByNorm.get(norm(targetName));
  if (liveP) matched.push({ row, liveP });
  else newInMaster.push(row.name);
}

const matchedLiveIds = new Set(matched.map((m) => m.liveP.id));
const liveOnly = live.filter((p) => !matchedLiveIds.has(p.id));

console.log(`Matched: ${matched.length}`);
console.log(`New in master (no live match): ${newInMaster.length}`);
newInMaster.forEach((n) => console.log("  +", n));
console.log(`Held out for manual confirmation: ${unresolved.length}`);
unresolved.forEach((n) => console.log("  ?", n));
console.log(`Live-only (not in master): ${liveOnly.length}`);
liveOnly.forEach((p) => console.log("  -", p.display_name));

const missingCollections = new Set();
for (const { row } of matched) {
  const series = normSeries(row.katha);
  if (series === "Dhara") missingCollections.add(series);
}
console.log(`\nSeries referenced with no live collection page: ${[...missingCollections].join(", ") || "none"}`);

// Sample diff for the first 5 matched products, to sanity-check field mapping.
console.log("\n--- Sample diffs (first 5 matched) ---");
for (const { row, liveP } of matched.slice(0, 5)) {
  const dims = parseSize(row.size);
  const series = normSeries(row.katha);
  const category = CATEGORY_MAP[row.category] ?? row.category;
  console.log(`\n${liveP.display_name} (${liveP.slug})`);
  console.log(`  about:        [${liveP.about?.length ?? 0} paras] -> ${JSON.stringify((row.description || "").split(/\n\n+/).map(s=>s.trim()).filter(Boolean))}`);
  console.log(`  product_code: "${liveP.product_code}" -> "${row.product_code}"`);
  console.log(`  material:     "${liveP.material}" -> "${fixMaterial(row.material)}"`);
  console.log(`  dims:         h="${liveP.dim_height}" w="${liveP.dim_width}" d="${liveP.dim_depth}" -> h="${dims.height}" w="${dims.width}" d="${dims.depth}"`);
  console.log(`  weight:       "${liveP.weight}" -> "${row.weight}"`);
  console.log(`  category:     "${liveP.category}" -> "${category}"`);
  console.log(`  series:       "${liveP.series}" -> "${series}"`);
}

fs.writeFileSync("/tmp/import-plan.json", JSON.stringify({ matched: matched.map(m => ({ slug: m.liveP.id, name: m.liveP.display_name, row: m.row })), newInMaster, liveOnly: liveOnly.map(p=>p.display_name), unresolved }, null, 2));
console.log("\nFull plan written to /tmp/import-plan.json");
