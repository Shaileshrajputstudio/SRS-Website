"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { cleanupRemovedImages } from "@/lib/storageCleanup";

export type ProductFormState = { error?: string };

function linesToArray(value: FormDataEntryValue | null): string[] {
  if (typeof value !== "string") return [];
  return value
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

export async function saveProduct(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const id = formData.get("id");
  const slug = (formData.get("slug") as string)?.trim();
  const displayName = (formData.get("displayName") as string)?.trim();

  if (!slug) return { error: "Slug is required." };
  if (!displayName) return { error: "Display name is required." };

  const images = formData
    .getAll("images")
    .filter((v): v is string => typeof v === "string" && v.length > 0);

  const payload = {
    slug,
    display_name: displayName,
    romanized: (formData.get("romanized") as string)?.trim() || displayName,
    series: (formData.get("series") as string)?.trim() || "—",
    category: formData.get("category") as string,
    placeholder: formData.get("placeholder") === "on",
    about: linesToArray(formData.get("about")),
    closing: linesToArray(formData.get("closing")),
    product_code: (formData.get("productCode") as string) || "—",
    material: (formData.get("material") as string) || "—",
    dim_height: (formData.get("dimHeight") as string) || "—",
    dim_width: (formData.get("dimWidth") as string) || "—",
    dim_depth: (formData.get("dimDepth") as string) || "—",
    weight: (formData.get("weight") as string) || "—",
    lead_time: (formData.get("leadTime") as string) || "Enquire for availability.",
    images,
  };

  if (typeof id === "string" && id) {
    const { data: existing } = await supabaseAdmin
      .from("products")
      .select("images")
      .eq("id", id)
      .maybeSingle();
    const { error } = await supabaseAdmin.from("products").update(payload).eq("id", id);
    if (error) return { error: error.message };
    await cleanupRemovedImages(existing?.images ?? [], images);
  } else {
    const { data: maxRow } = await supabaseAdmin
      .from("products")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    const sortOrder = (maxRow?.sort_order ?? -1) + 1;
    const { error } = await supabaseAdmin
      .from("products")
      .insert({ ...payload, sort_order: sortOrder });
    if (error) return { error: error.message };
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  const { data: existing } = await supabaseAdmin.from("products").select("images").eq("id", id).maybeSingle();
  const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await cleanupRemovedImages(existing?.images ?? [], []);
  revalidatePath("/admin/products");
  revalidatePath("/products");
}
