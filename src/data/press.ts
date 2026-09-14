import "server-only";
import { supabasePublic } from "@/lib/supabasePublic";

// Press & exhibition entries now live in Supabase, edited through
// /admin/press — this file is the typed read layer the public pages use.
export type PressEntry = {
  title: string;
  venue: string;
  year: string;
  status: "Upcoming" | "Past";
  category: "Exhibition" | "Press";
  placeholder: boolean;
  description: string;
  url?: string;
  image?: string;
  images?: string[];
  logo?: string;
};

type PressRow = {
  title: string;
  venue: string;
  year: string;
  status: PressEntry["status"];
  category: PressEntry["category"];
  placeholder: boolean;
  description: string;
  url: string | null;
  image_url: string | null;
  images: string[] | null;
  logo_url: string | null;
};

function mapPressEntry(row: PressRow): PressEntry {
  return {
    title: row.title,
    venue: row.venue,
    year: row.year,
    status: row.status,
    category: row.category,
    placeholder: row.placeholder,
    description: row.description,
    url: row.url ?? undefined,
    image: row.image_url ?? undefined,
    images: row.images && row.images.length > 0 ? row.images : undefined,
    logo: row.logo_url ?? undefined,
  };
}

export async function getAllPressEntries(): Promise<PressEntry[]> {
  const { data, error } = await supabasePublic.from("press_entries").select("*").order("sort_order");
  if (error) throw error;
  return (data ?? []).map(mapPressEntry);
}
