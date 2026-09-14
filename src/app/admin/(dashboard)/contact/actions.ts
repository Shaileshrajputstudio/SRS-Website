"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export type ContactFormState = { error?: string; success?: boolean };

export async function saveContactInfo(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const { error } = await supabaseAdmin.from("studio_info").upsert({
    id: true,
    phone: (formData.get("phone") as string)?.trim() ?? "",
    whatsapp: (formData.get("whatsapp") as string)?.trim() ?? "",
    email: (formData.get("email") as string)?.trim() ?? "",
    instagram: (formData.get("instagram") as string)?.trim() ?? "",
    instagram_dm: (formData.get("instagramDm") as string)?.trim() ?? "",
    facebook: (formData.get("facebook") as string)?.trim() ?? "",
    address: (formData.get("address") as string) ?? "",
  });
  if (error) return { error: error.message };

  revalidatePath("/admin/contact");
  revalidatePath("/", "layout");
  return { success: true };
}
