"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { cleanupRemovedImages } from "@/lib/storageCleanup";
import type { FilmRow } from "@/components/admin/FilmListEditor";
import type { ElementData } from "./ElementEditor";

export type CollectionFormState = { error?: string };

// Reconciles one parent's (a collection's or an element's) film list
// against what's submitted: deletes rows for films the studio removed,
// then upserts the rest. Films are matched by slug (globally unique), so
// editing an existing film's fields updates in place; a brand-new row
// (added via "+ Add film") gets a fresh slug derived from its title.
// Also cleans up any poster images that were removed or replaced along
// the way, whether the film itself was deleted or just re-posted.
async function syncFilms(
  parentColumn: "collection_id" | "element_id",
  parentId: string,
  filmRows: FilmRow[],
) {
  const { data: existingFilms } = await supabaseAdmin
    .from("films")
    .select("poster_url")
    .eq(parentColumn, parentId);
  const oldPosters = (existingFilms ?? []).map((f) => f.poster_url);

  const slugs = filmRows.map((f) => f.slug).filter(Boolean);

  let delQuery = supabaseAdmin.from("films").delete().eq(parentColumn, parentId);
  if (slugs.length > 0) {
    delQuery = delQuery.not("slug", "in", `(${slugs.map((s) => `"${s}"`).join(",")})`);
  }
  const { error: delError } = await delQuery;
  if (delError) throw delError;

  if (filmRows.length > 0) {
    const { error: upsertError } = await supabaseAdmin.from("films").upsert(
      filmRows.map((f, i) => ({
        [parentColumn]: parentId,
        slug: f.slug || `film-${crypto.randomUUID()}`,
        title: f.title,
        duration: f.duration,
        type: f.type,
        video_url: f.video_url || null,
        poster_url: f.poster_url || null,
        sort_order: i,
      })),
      { onConflict: "slug" },
    );
    if (upsertError) throw upsertError;
  }

  await cleanupRemovedImages(oldPosters, filmRows.map((f) => f.poster_url));
}

export async function saveCollection(
  _prevState: CollectionFormState,
  formData: FormData,
): Promise<CollectionFormState> {
  const idField = formData.get("id");
  const isNew = typeof idField !== "string" || !idField;

  const title = (formData.get("title") as string)?.trim();
  if (!title) return { error: "Title is required." };
  const newCoverUrl = (formData.get("coverUrl") as string) || null;

  let id: string;

  if (isNew) {
    const slug = (formData.get("slug") as string)?.trim();
    if (!slug) return { error: "Slug is required." };

    const { data: maxRow } = await supabaseAdmin
      .from("collections")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    const sortOrder = (maxRow?.sort_order ?? -1) + 1;

    const { data: inserted, error: insertError } = await supabaseAdmin
      .from("collections")
      .insert({
        slug,
        title,
        sanskrit_name: (formData.get("sanskritName") as string) ?? "",
        myth: (formData.get("myth") as string) ?? "",
        material_story: (formData.get("materialStory") as string) ?? "",
        cover_url: newCoverUrl,
        sort_order: sortOrder,
      })
      .select("id")
      .single();
    if (insertError) {
      return {
        error: insertError.message.includes("duplicate key")
          ? "A story with this slug already exists."
          : insertError.message,
      };
    }
    id = inserted.id;
  } else {
    id = idField as string;
    const { data: existingCollection } = await supabaseAdmin
      .from("collections")
      .select("cover_url")
      .eq("id", id)
      .maybeSingle();

    const { error: collectionError } = await supabaseAdmin
      .from("collections")
      .update({
        title,
        sanskrit_name: (formData.get("sanskritName") as string) ?? "",
        myth: (formData.get("myth") as string) ?? "",
        material_story: (formData.get("materialStory") as string) ?? "",
        cover_url: newCoverUrl,
      })
      .eq("id", id);
    if (collectionError) return { error: collectionError.message };
    await cleanupRemovedImages([existingCollection?.cover_url], [newCoverUrl]);
  }

  const filmsJson = formData.get("filmsJson") as string | null;
  const films: FilmRow[] = filmsJson ? JSON.parse(filmsJson) : [];
  try {
    await syncFilms("collection_id", id, films);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save films." };
  }

  const elementsJson = formData.get("elementsJson") as string | null;
  if (elementsJson) {
    const elements: ElementData[] = JSON.parse(elementsJson);
    for (const el of elements) {
      const { data: existingElement } = await supabaseAdmin
        .from("elements")
        .select("cover_url")
        .eq("id", el.id)
        .maybeSingle();
      const newElementCover = el.cover_url || null;

      const { error: elError } = await supabaseAdmin
        .from("elements")
        .update({
          title: el.title,
          sanskrit_name: el.sanskrit_name,
          element: el.element,
          myth: el.myth,
          material_story: el.material_story,
          cover_url: newElementCover,
        })
        .eq("id", el.id);
      if (elError) return { error: elError.message };
      await cleanupRemovedImages([existingElement?.cover_url], [newElementCover]);

      try {
        await syncFilms("element_id", el.id, el.films);
      } catch (err) {
        return { error: err instanceof Error ? err.message : "Failed to save element films." };
      }
    }
  }

  revalidatePath("/admin/collections");
  revalidatePath("/collections");
  revalidatePath("/films");
  redirect("/admin/collections");
}
