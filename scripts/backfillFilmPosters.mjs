import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
);

// Mirrors collections.ts's filmPoster(): a real frame grab (.jpg) when the
// film has real footage (video_url set), otherwise the generated
// placeholder (.svg) — same convention the public site currently uses.
const { data: films, error } = await supabase.from("films").select("id,slug,video_url");
if (error) throw error;

for (const film of films) {
  const ext = film.video_url ? "jpg" : "svg";
  const posterUrl = `/images/films/${film.slug}.${ext}`;
  const { error: updateError } = await supabase
    .from("films")
    .update({ poster_url: posterUrl })
    .eq("id", film.id);
  if (updateError) throw updateError;
}

console.log(`Backfilled poster_url for ${films.length} films.`);
