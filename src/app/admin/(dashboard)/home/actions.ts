"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export type HomePageFormState = { error?: string; success?: boolean };

export async function saveHomePage(
  _prevState: HomePageFormState,
  formData: FormData,
): Promise<HomePageFormState> {
  const featuredProductSlugs = formData
    .getAll("featuredProductSlugs")
    .filter((v): v is string => typeof v === "string" && v.length > 0);

  const { error } = await supabaseAdmin.from("home_page").upsert({
    id: true,
    hero_video_url: (formData.get("heroVideoUrl") as string)?.trim() || null,
    hero_eyebrow: (formData.get("heroEyebrow") as string)?.trim() ?? "",
    hero_headline: (formData.get("heroHeadline") as string)?.trim() ?? "",
    featured_product_slugs: featuredProductSlugs,
  });
  if (error) return { error: error.message };

  revalidatePath("/admin/home");
  revalidatePath("/");
  return { success: true };
}
