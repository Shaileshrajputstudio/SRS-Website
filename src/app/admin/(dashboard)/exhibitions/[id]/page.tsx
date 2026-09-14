import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { PressForm } from "../../press/PressForm";

export const dynamic = "force-dynamic";

export default async function EditExhibitionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: entry } = await supabaseAdmin.from("press_entries").select("*").eq("id", id).maybeSingle();
  if (!entry) notFound();

  return <PressForm entry={entry} category={entry.category} />;
}
