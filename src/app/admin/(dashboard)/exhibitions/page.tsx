import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { PressListClient } from "../press/PressListClient";
import { LinkButton } from "@/components/admin/ui";
import { PlusIcon } from "@/components/admin/icons";

export const dynamic = "force-dynamic";

export default async function AdminExhibitionsPage() {
  const { data: entries } = await supabaseAdmin
    .from("press_entries")
    .select("id,title,venue,status,placeholder,image_url,logo_url")
    .eq("category", "Exhibition")
    .order("sort_order");

  return (
    <div className="max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Exhibitions</h1>
        <LinkButton href="/admin/exhibitions/new">
          <PlusIcon />
          Add exhibition
        </LinkButton>
      </div>

      <PressListClient entries={entries ?? []} editBasePath="/admin/exhibitions" />
    </div>
  );
}
