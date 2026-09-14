import "server-only";
import { supabasePublic } from "@/lib/supabasePublic";

export type StudioContactInfo = {
  phone: string;
  whatsapp: string;
  email: string;
  instagram: string;
  instagramDm: string;
  facebook: string;
  addressLines: string[];
  addressFull: string;
};

const FALLBACK: StudioContactInfo = {
  phone: "+919967788543",
  whatsapp: "919967788543",
  email: "shaileshrajputstudio@gmail.com",
  instagram: "https://www.instagram.com/shaileshrajputstudio/",
  instagramDm: "https://ig.me/m/shaileshrajputstudio",
  facebook: "https://www.facebook.com/ShaileshRajputStudio",
  addressLines: [
    "Studio No. 19, Ground Floor, 11 Cama Industrial Estate, Opposite Post Office,",
    "Sitaram Jadhav Marg, Sun Mill Compound, Lower Parel, Mumbai - 400013",
  ],
  addressFull:
    "Studio No. 19, Ground Floor, 11 Cama Industrial Estate, Opposite Post Office, Sitaram Jadhav Marg, Sun Mill Compound, Lower Parel, Mumbai - 400013",
};

export async function getStudioContactInfo(): Promise<StudioContactInfo> {
  const { data, error } = await supabasePublic.from("studio_info").select("*").eq("id", true).maybeSingle();
  if (error || !data) return FALLBACK;

  const addressLines = data.address
    ? data.address.split("\n").filter((l: string) => l.trim().length > 0)
    : FALLBACK.addressLines;

  return {
    phone: data.phone || FALLBACK.phone,
    whatsapp: data.whatsapp || FALLBACK.whatsapp,
    email: data.email || FALLBACK.email,
    instagram: data.instagram || FALLBACK.instagram,
    instagramDm: data.instagram_dm || FALLBACK.instagramDm,
    facebook: data.facebook || FALLBACK.facebook,
    addressLines,
    addressFull: addressLines.join(" "),
  };
}
