"use server";

import { sendEnquiryEmail } from "@/lib/email";

export type EnquiryFormState = { success?: boolean; error?: string };

// Deliberately not the admin-editable studio_info.email shown on /contact —
// that's the public-facing address visitors see and click to email
// directly. Who actually receives Converse enquiries is an infra decision,
// not content, so it's pinned to an env var instead (same pattern as
// PASSWORD_RECOVERY_EMAIL).
const ENQUIRY_TO_EMAIL = process.env.ENQUIRY_EMAIL || "it.shaileshrajputstudio@gmail.com";

export async function submitEnquiry(
  _prevState: EnquiryFormState,
  formData: FormData,
): Promise<EnquiryFormState> {
  const name = (formData.get("name") as string)?.trim() ?? "";
  const contact = (formData.get("contact") as string)?.trim() ?? "";
  if (!name || !contact) return { error: "Name and email or phone are required." };

  try {
    await sendEnquiryEmail(ENQUIRY_TO_EMAIL, {
      name,
      contact,
      collectionLabel: (formData.get("collectionLabel") as string)?.trim() || "Not specified",
      intent: (formData.get("intent") as string) || "Not specified",
      location: (formData.get("location") as string)?.trim() ?? "",
      message: (formData.get("message") as string)?.trim() ?? "",
    });
  } catch {
    return { error: "Something went wrong sending your message. Please try again, or reach us directly on WhatsApp." };
  }

  return { success: true };
}
