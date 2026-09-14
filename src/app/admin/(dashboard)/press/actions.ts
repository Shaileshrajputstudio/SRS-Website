"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { cleanupRemovedImages } from "@/lib/storageCleanup";

export type PressFormState = { error?: string };

function adminPathFor(category: string) {
  return category === "Exhibition" ? "/admin/exhibitions" : "/admin/press";
}

export async function savePress(
  _prevState: PressFormState,
  formData: FormData,
): Promise<PressFormState> {
  const id = formData.get("id");
  const title = (formData.get("title") as string)?.trim();
  if (!title) return { error: "Title is required." };

  const category = formData.get("category") as string;
  const images = formData
    .getAll("images")
    .filter((v): v is string => typeof v === "string" && v.length > 0);

  const payload = {
    title,
    venue: (formData.get("venue") as string)?.trim() ?? "",
    year: (formData.get("year") as string)?.trim() ?? "",
    status: formData.get("status") as string,
    category,
    placeholder: formData.get("placeholder") === "on",
    description: (formData.get("description") as string) ?? "",
    url: (formData.get("url") as string) || null,
    image_url: (formData.get("imageUrl") as string) || null,
    logo_url: (formData.get("logoUrl") as string) || null,
    images,
  };

  if (typeof id === "string" && id) {
    const { data: existing } = await supabaseAdmin
      .from("press_entries")
      .select("image_url,logo_url,images")
      .eq("id", id)
      .maybeSingle();
    const { error } = await supabaseAdmin.from("press_entries").update(payload).eq("id", id);
    if (error) return { error: error.message };
    await cleanupRemovedImages(
      [existing?.image_url, existing?.logo_url, ...(existing?.images ?? [])],
      [payload.image_url, payload.logo_url, ...images],
    );
  } else {
    const { data: maxRow } = await supabaseAdmin
      .from("press_entries")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    const sortOrder = (maxRow?.sort_order ?? -1) + 1;
    const { error } = await supabaseAdmin
      .from("press_entries")
      .insert({ ...payload, sort_order: sortOrder });
    if (error) return { error: error.message };
  }

  revalidatePath("/admin/exhibitions");
  revalidatePath("/admin/press");
  revalidatePath("/press");
  redirect(adminPathFor(category));
}

export async function deletePress(id: string) {
  const { data: existing } = await supabaseAdmin
    .from("press_entries")
    .select("image_url,logo_url,images")
    .eq("id", id)
    .maybeSingle();
  const { error } = await supabaseAdmin.from("press_entries").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await cleanupRemovedImages([existing?.image_url, existing?.logo_url, ...(existing?.images ?? [])], []);
  revalidatePath("/admin/exhibitions");
  revalidatePath("/admin/press");
  revalidatePath("/press");
}
