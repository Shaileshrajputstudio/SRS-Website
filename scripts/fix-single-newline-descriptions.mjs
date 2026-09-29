import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config({ path: ".env.local" });

const APPLY = process.argv.includes("--apply");

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);
const master = JSON.parse(fs.readFileSync("/tmp/master-products.json", "utf-8"));

const ALIASES = { "MAR:G": "MAR:GA" }; // only alias relevant to the affected set

const AFFECTED = [
  "SAMBHU MINI", "SAMBHU TEXTURED", "SAMBHU TEXTURED MINI", "SAMBHU EYE",
  "SUN:YA SAMUHA", "MU:SHA", "VI:KAYA", "JHO:LA", "SEE:TA", "UD:BHAV", "LE:HAR",
];

// Falls back to single "\n" when the row has no blank-line breaks at all —
// a handful of rows in the source file were typed with single line breaks
// instead of the double breaks the rest of the sheet uses. Two of those
// rows (MU:SHA, VI:KAYA) quote Hindi verse where each "\n" is a poetic
// line break, not a paragraph break — splitting on it would shred the
// verse into one-line "paragraphs", so those get joined back into flowing
// prose instead, same treatment the rest of the site's about text gets.
// MU:SHA and VI:KAYA quote real Kabir dohas — worth the same care a human
// editor would give a couplet, not a regex. Hand-set rather than derived.
const HAND_CURATED = {
  "MU:SHA": {
    about: [
      "A light inspired by Kabir’s understanding of the many forms of the divine.",
      "“एक राम दशरथ का बेटा, एक राम घट घट में बैठा। एक राम को सकल परासा, एक राम त्रिभुवन से न्यारा।”",
      "In this verse, Kabir speaks of four Ramas: one dwelt in Dasharath’s home, one resides within every being, one has expanded into all creation, and one is beyond them all.",
      "MU:SHA reflects this journey through a radiant centre surrounded by quiet layers, symbolising the many manifestations of the divine and the unity that lies beyond them all.",
    ],
    closing: ["Where all forms meet the same light."],
  },
  "VI:KAYA": {
    about: [
      "A light inspired by Kabir’s wisdom that the divine resides within.",
      "“ज्यों नैनों की पुतली, त्यों मालिक घट माहीं। मूरख लोग ना जानहीं, बाहर ढूंढन जाहीं।”",
      "In this verse, Kabir speaks of a truth often overlooked: the divine dwells within us, as naturally as the pupil within the eye. Yet in ignorance, we search outward for what already exists within.",
      "VI:KAYA is a reflection of this wisdom, drawing the gaze inward toward stillness, awareness and self-discovery.",
    ],
    closing: ["Where the seeker finds the sought."],
  },
  // Source cell is missing the trailing period on its tagline — every
  // other row's tagline ends with one.
  "SEE:TA": {
    about: [
      "Canyon Layers inspired light.",
      "This light is inspired from the layered walls and narrow passages of canyons, where erosion creates deep, contrasting formations. The rich earthen texture evokes exposed rock, while the illuminated crevice becomes a quiet opening through the landscape, bringing warmth from within.",
    ],
    closing: ["Where the earth breaks open, revealing a quiet glow hidden within its layers."],
  },
  // Source cell is missing the leading "L" ("ight" -> "Light"), and its
  // second sentence was line-wrapped mid-sentence in the spreadsheet.
  "UD:BHAV": {
    about: [
      "Light inspired by natural openings in canyons.",
      "A quiet pair of sculptural lights, shaped with simple, organic forms that echo the openings and contours found within canyon walls. A single cut-out becomes the focal point, allowing light to pass through softly while creating a subtle interplay of light and shadow.",
    ],
    closing: ["Two simple forms, shaped by nature, with light finding its way through a single opening."],
  },
  // Source cell's second sentence was line-wrapped mid-sentence in the
  // spreadsheet ("...ridges, and\nvalleys...").
  "LE:HAR": {
    about: [
      "The flow of river in canyons inspired light.",
      "The flowing river is at the heart of this piece, its movement slowly carving and shaping the landscape around it. The central texture follows these natural currents, creating layers, ridges, and valleys that seem to move across the surface.",
    ],
    closing: ["Where water flows, the earth slowly takes its shape."],
  },
};

const DEVANAGARI = /[ऀ-ॿ]/;

function splitDescription(description) {
  const raw = description || "";
  let parts = raw.split(/\n\n+/).map((s) => s.trim()).filter(Boolean);
  if (parts.length <= 1 && raw.includes("\n")) {
    if (DEVANAGARI.test(raw)) {
      const joined = raw.split(/\n+/).map((s) => s.trim()).filter(Boolean).join(" ");
      parts = [joined];
    } else {
      parts = raw.split(/\n+/).map((s) => s.trim()).filter(Boolean);
    }
  }
  if (parts.length <= 1) return { about: parts, closing: [] };
  return { about: parts.slice(0, -1), closing: [parts[parts.length - 1]] };
}

function norm(s) {
  return s.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

const { data: live, error } = await supabase.from("products").select("id,display_name").order("sort_order");
if (error) throw error;
const liveByNorm = new Map(live.map((p) => [norm(p.display_name), p]));

console.log(`${APPLY ? "APPLYING" : "DRY RUN"}\n`);
for (const name of AFFECTED) {
  const row = master.find((r) => r.name === name);
  if (!row) { console.log(`SKIP (not in master): ${name}`); continue; }
  const targetName = ALIASES[row.name] ?? row.name;
  const liveP = liveByNorm.get(norm(targetName));
  if (!liveP) { console.log(`SKIP (no live match): ${name}`); continue; }

  const { about, closing } = HAND_CURATED[row.name] ?? splitDescription(row.description);
  console.log(`${liveP.display_name} (${liveP.id})`);
  console.log(`  about:   ${JSON.stringify(about)}`);
  console.log(`  closing: ${JSON.stringify(closing)}`);

  if (APPLY) {
    const { error: updErr } = await supabase.from("products").update({ about, closing }).eq("id", liveP.id);
    if (updErr) console.error(`  FAILED: ${updErr.message}`);
  }
}
