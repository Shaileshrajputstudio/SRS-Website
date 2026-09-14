import "server-only";
import { supabasePublic } from "@/lib/supabasePublic";

// Collections, their six elemental sub-chapters (Panch Bhuta only), and
// films now live in Supabase, edited through /admin/collections — this
// file is the typed read layer the public pages use, matching the shape
// the site's components were originally built against. See
// supabase/schema.sql for the table definitions.

export type Film = {
  slug: string;
  title: string;
  duration: string;
  type: "Brand Film" | "Process Film" | "Collection Film";
  videoSrc?: string; // real, playable video — when absent, falls back to a placeholder poster linking to /films
  posterUrl?: string; // set via the admin's image uploader; falls back to a generic placeholder when absent
};

// One of Panch Bhuta's six elemental sub-chapters.
export type Element = {
  slug: string;
  title: string;
  sanskritName: string;
  element: string; // Earth / Water / Fire / Air / Ether / Metal
  coverUrl: string | null;
  placeholder: boolean;
  myth: string;
  materialStory: string;
  films: Film[];
};

export type Collection = {
  slug: string;
  title: string;
  sanskritName: string;
  coverUrl: string | null;
  placeholder: boolean;
  myth: string;
  materialStory: string;
  films: Film[];
  elements?: Element[]; // present only on the Panch Bhuta entry
};

type FilmRow = {
  slug: string;
  title: string;
  duration: string;
  type: Film["type"];
  video_url: string | null;
  poster_url: string | null;
  collection_id: string | null;
  element_id: string | null;
};

type CollectionRow = {
  id: string;
  slug: string;
  title: string;
  sanskrit_name: string;
  cover_url: string | null;
  placeholder: boolean;
  myth: string;
  material_story: string;
};

type ElementRow = {
  id: string;
  collection_id: string;
  slug: string;
  title: string;
  sanskrit_name: string;
  element: string;
  cover_url: string | null;
  placeholder: boolean;
  myth: string;
  material_story: string;
};

function mapFilm(row: FilmRow): Film {
  return {
    slug: row.slug,
    title: row.title,
    duration: row.duration,
    type: row.type,
    videoSrc: row.video_url ?? undefined,
    posterUrl: row.poster_url ?? undefined,
  };
}

// Fetches every collection, element, and their films in three queries
// total (not N+1 per collection), then assembles the nested shape the
// page components expect.
async function getAllCollectionsWithChildren(): Promise<Collection[]> {
  const [{ data: collectionRows, error: cErr }, { data: elementRows, error: eErr }, { data: filmRows, error: fErr }] =
    await Promise.all([
      supabasePublic.from("collections").select("*").order("sort_order"),
      supabasePublic.from("elements").select("*").order("sort_order"),
      supabasePublic.from("films").select("*").order("sort_order"),
    ]);
  if (cErr) throw cErr;
  if (eErr) throw eErr;
  if (fErr) throw fErr;

  const filmsByCollection = new Map<string, Film[]>();
  const filmsByElement = new Map<string, Film[]>();
  for (const row of (filmRows ?? []) as FilmRow[]) {
    const film = mapFilm(row);
    if (row.collection_id) {
      filmsByCollection.set(row.collection_id, [...(filmsByCollection.get(row.collection_id) ?? []), film]);
    } else if (row.element_id) {
      filmsByElement.set(row.element_id, [...(filmsByElement.get(row.element_id) ?? []), film]);
    }
  }

  const elementsByCollection = new Map<string, Element[]>();
  for (const row of (elementRows ?? []) as ElementRow[]) {
    const element: Element = {
      slug: row.slug,
      title: row.title,
      sanskritName: row.sanskrit_name,
      element: row.element,
      coverUrl: row.cover_url,
      placeholder: row.placeholder,
      myth: row.myth,
      materialStory: row.material_story,
      films: filmsByElement.get(row.id) ?? [],
    };
    elementsByCollection.set(row.collection_id, [...(elementsByCollection.get(row.collection_id) ?? []), element]);
  }

  return ((collectionRows ?? []) as CollectionRow[]).map((row) => ({
    slug: row.slug,
    title: row.title,
    sanskritName: row.sanskrit_name,
    coverUrl: row.cover_url,
    placeholder: row.placeholder,
    myth: row.myth,
    materialStory: row.material_story,
    films: filmsByCollection.get(row.id) ?? [],
    elements: row.slug === "panch-bhuta" ? (elementsByCollection.get(row.id) ?? []) : undefined,
  }));
}

export async function getAllCollections(): Promise<Collection[]> {
  return getAllCollectionsWithChildren();
}

export async function getPanchBhuta(): Promise<Collection> {
  const collections = await getAllCollectionsWithChildren();
  const panchBhuta = collections.find((c) => c.slug === "panch-bhuta");
  if (!panchBhuta) throw new Error("Panch Bhuta collection not found");
  return panchBhuta;
}

export async function getElements(): Promise<Element[]> {
  const panchBhuta = await getPanchBhuta();
  return panchBhuta.elements ?? [];
}

// The five sibling stories alongside Panch Bhuta (excludes Panch Bhuta
// itself, which has its own overview + nested-element route structure).
export async function getStoryCollections(): Promise<Collection[]> {
  const collections = await getAllCollectionsWithChildren();
  return collections.filter((c) => c.slug !== "panch-bhuta");
}

export async function getCollectionBySlug(slug: string): Promise<Collection | undefined> {
  const collections = await getAllCollectionsWithChildren();
  return collections.find((c) => c.slug === slug);
}

// Cover photos and film posters are now explicit URLs stored per-row
// (set via the admin's image uploader), not derived from a filename
// convention — these stay as functions so call sites are unchanged. The
// generic press placeholder SVGs are reused as a last-resort fallback for
// the rare case of a brand-new film added without a poster yet.
export function coverImage(c: Collection | Element): string {
  return c.coverUrl ?? "/images/press/press-1.svg";
}

export function filmPoster(film: Film): string {
  return film.posterUrl ?? "/images/press/press-2.svg";
}
