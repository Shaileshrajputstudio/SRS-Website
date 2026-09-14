import { NextResponse } from "next/server";
import { getProductCategories } from "@/data/products";
import { getAllCollections } from "@/data/collections";

// Lets other tools (the catalogue-sharing admin) read the current /products
// categories and /collections stories without hardcoding a copy of either —
// add one here and it shows up there within the hour, no redeploy of the
// other project needed. Public and read-only; none of this is sensitive.
export async function GET() {
  const [categories, collections] = await Promise.all([getProductCategories(), getAllCollections()]);
  return NextResponse.json(
    {
      categories,
      collections: collections.map((c) => ({ slug: c.slug, title: c.title })),
    },
    { headers: { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" } },
  );
}
