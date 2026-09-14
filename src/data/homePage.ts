import "server-only";
import { supabasePublic } from "@/lib/supabasePublic";

export type HomePageContent = {
  heroVideoUrl: string;
  heroEyebrow: string;
  heroHeadline: string;
  featuredProductSlugs: string[];
};

const FALLBACK: HomePageContent = {
  heroVideoUrl: "/videos/arrival-hero.mp4",
  heroEyebrow: "An Evolving Practice of Life and Design",
  heroHeadline: "Objects that carry soul and story into spaces.",
  featuredProductSlugs: [],
};

export async function getHomePageContent(): Promise<HomePageContent> {
  const { data, error } = await supabasePublic.from("home_page").select("*").eq("id", true).maybeSingle();
  if (error || !data) return FALLBACK;
  return {
    heroVideoUrl: data.hero_video_url || FALLBACK.heroVideoUrl,
    heroEyebrow: data.hero_eyebrow || FALLBACK.heroEyebrow,
    heroHeadline: data.hero_headline || FALLBACK.heroHeadline,
    featuredProductSlugs: data.featured_product_slugs ?? [],
  };
}
