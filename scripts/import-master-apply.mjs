import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config({ path: ".env.local" });

const APPLY = process.argv.includes("--apply");

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);
const master = JSON.parse(fs.readFileSync("/tmp/master-products.json", "utf-8"));

const { data: live, error } = await supabase.from("products").select("*").order("sort_order");
if (error) throw error;

const ALIASES = {
  "AUṂ": "AUM",
  "E:RAYA MIRROR I": "ERAYA I",
  "E:RAYA MIRROR II": "ERAYA II",
  "E:RAYA MIRROR III": "ERAYA III",
  "E:RAYA MIRROR IV": "ERAYA IV",
  "E:RAYA MIRROR V": "ERAYA V",
  "TI:VRA Bench": "TI:VRA Bench (set of 2)",
  "SURYA NAMASKAR": "SURYA NAMASKAR Wall Clock",
  "MAR:G": "MAR:GA",
};

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
  if (!katha || katha === "NA") return null; // null = leave the live value alone
  let s = katha.trim().replace(/\s*-\s*Panch Bhuta$/i, "");
  return SERIES_MAP[s] ?? s;
}

function norm(s) {
  return s.toUpperCase().replace(/[^A-Z0-9]/g, "");
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

// Split on blank lines: the file's description is consistently
// [tagline, body, ...] with the last short line reading as a closing
// reflection (matches how existing well-written products like MAR:GA
// already split about/closing).
function splitDescription(description) {
  const parts = (description || "")
    .split(/\n\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length <= 1) return { about: parts, closing: [] };
  return { about: parts.slice(0, -1), closing: [parts[parts.length - 1]] };
}

const liveByNorm = new Map(live.map((p) => [norm(p.display_name), p]));
const matched = [];
for (const row of master) {
  const targetName = ALIASES[row.name] ?? row.name;
  const liveP = liveByNorm.get(norm(targetName));
  if (liveP) matched.push({ row, liveP });
}

console.log(`${APPLY ? "APPLYING" : "DRY RUN"} — ${matched.length} products\n`);

let updated = 0;
for (const { row, liveP } of matched) {
  const { about, closing } = splitDescription(row.description);
  const dims = parseSize(row.size);
  const series = normSeries(row.katha);
  const category = CATEGORY_MAP[row.category] ?? row.category;

  const payload = {
    about,
    closing,
    product_code: row.product_code || "—",
    material: fixMaterial(row.material),
    dim_height: dims.height,
    dim_width: dims.width,
    dim_depth: dims.depth,
    weight: row.weight || "—",
    lighting_spec: row.lighting_spec || "—",
    category,
  };
  if (series) payload.series = series;

  if (APPLY) {
    const { error: updErr } = await supabase.from("products").update(payload).eq("id", liveP.id);
    if (updErr) {
      console.error(`FAILED ${liveP.display_name}: ${updErr.message}`);
      continue;
    }
  }
  updated++;
}

console.log(`${APPLY ? "Updated" : "Would update"}: ${updated} / ${matched.length}`);
