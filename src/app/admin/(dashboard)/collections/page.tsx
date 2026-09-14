import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { Card, LinkButton } from "@/components/admin/ui";
import { ImageIcon, PlusIcon } from "@/components/admin/icons";

export const dynamic = "force-dynamic";

// Panch Bhuta is the one special case — it has its own elemental
// sub-chapters (see ElementEditor) and a dedicated public page. Every
// other story, including new ones added here, is a plain collection:
// title, myth, material story, films. The public /collections/[slug]
// route is fully data-driven, so a new story here gets a working page
// automatically.
export default async function AdminCollectionsPage() {
  const { data: collections } = await supabaseAdmin
    .from("collections")
    .select("id,slug,title,sanskrit_name,cover_url")
    .order("sort_order");

  return (
    <div className="max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Story Categories</h1>
        <LinkButton href="/admin/collections/new">
          <PlusIcon />
          Add story
        </LinkButton>
      </div>

      <Card className="divide-y divide-gray-100">
        {(collections ?? []).map((c) => (
          <div key={c.id} className="flex items-center gap-4 px-4 py-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-50">
              {c.cover_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.cover_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <ImageIcon className="h-5 w-5 text-gray-300" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900">{c.title}</p>
              <p className="truncate text-xs text-gray-400">{c.sanskrit_name}</p>
            </div>
            <Link
              href={`/admin/collections/${c.id}`}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
            >
              Edit
            </Link>
          </div>
        ))}
      </Card>
    </div>
  );
}
