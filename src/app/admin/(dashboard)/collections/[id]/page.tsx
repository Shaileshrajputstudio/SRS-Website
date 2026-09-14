import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { CollectionForm, type CollectionRecord } from "../CollectionForm";

export const dynamic = "force-dynamic";

const FILM_COLUMNS = "slug,title,duration,type,video_url,poster_url";

export default async function EditCollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: collection } = await supabaseAdmin
    .from("collections")
    .select("id,slug,title,sanskrit_name,cover_url,myth,material_story")
    .eq("id", id)
    .maybeSingle();
  if (!collection) notFound();

  const [{ data: films }, { data: elementRows }] = await Promise.all([
    supabaseAdmin
      .from("films")
      .select(FILM_COLUMNS)
      .eq("collection_id", id)
      .order("sort_order"),
    supabaseAdmin
      .from("elements")
      .select("id,slug,title,sanskrit_name,element,cover_url,myth,material_story")
      .eq("collection_id", id)
      .order("sort_order"),
  ]);

  const hasElements = (elementRows ?? []).length > 0;

  const elements = hasElements
    ? await Promise.all(
        (elementRows ?? []).map(async (el) => {
          const { data: elFilms } = await supabaseAdmin
            .from("films")
            .select(FILM_COLUMNS)
            .eq("element_id", el.id)
            .order("sort_order");
          return {
            ...el,
            cover_url: el.cover_url ?? "",
            films: (elFilms ?? []).map((f) => ({ ...f, video_url: f.video_url ?? "", poster_url: f.poster_url ?? "" })),
          };
        }),
      )
    : undefined;

  const record: CollectionRecord = {
    ...collection,
    films: (films ?? []).map((f) => ({ ...f, video_url: f.video_url ?? "", poster_url: f.poster_url ?? "" })),
    elements,
  };

  return <CollectionForm collection={record} />;
}
