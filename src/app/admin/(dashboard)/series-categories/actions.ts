"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export type CategoryFormState = { error?: string };

function friendlyError(message: string) {
  if (message.includes("duplicate key")) return "A category with this name already exists.";
  if (message.includes("violates foreign key")) {
    return "This category is still used by one or more products — give them a different category first.";
  }
  return message;
}

export async function addCategory(
  _prevState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Name is required." };

  const { data: maxRow } = await supabaseAdmin
    .from("product_categories")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const sortOrder = (maxRow?.sort_order ?? -1) + 1;

  const { error } = await supabaseAdmin
    .from("product_categories")
    .insert({ name, sort_order: sortOrder });
  if (error) return { error: friendlyError(error.message) };

  revalidatePath("/admin/series-categories");
  revalidatePath("/admin/products");
  revalidatePath("/products");
  return {};
}

export async function renameCategory(id: string, formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  if (!name) return;

  const { error } = await supabaseAdmin.from("product_categories").update({ name }).eq("id", id);
  if (error) throw new Error(friendlyError(error.message));

  revalidatePath("/admin/series-categories");
  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export async function deleteCategory(id: string) {
  const { error } = await supabaseAdmin.from("product_categories").delete().eq("id", id);
  if (error) throw new Error(friendlyError(error.message));

  revalidatePath("/admin/series-categories");
  revalidatePath("/admin/products");
  revalidatePath("/products");
}
