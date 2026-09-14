import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getHomePageContent } from "@/data/homePage";
import { HomePageForm } from "./HomePageForm";

export const dynamic = "force-dynamic";

export default async function AdminHomePagePage() {
  const [content, { data: products }] = await Promise.all([
    getHomePageContent(),
    supabaseAdmin.from("products").select("slug,display_name").order("sort_order"),
  ]);

  return (
    <div>
      <h1 className="mb-8 text-2xl font-semibold text-gray-900">Home Page</h1>
      <HomePageForm
        content={content}
        allProducts={(products ?? []).map((p) => ({ slug: p.slug, displayName: p.display_name }))}
      />
    </div>
  );
}
