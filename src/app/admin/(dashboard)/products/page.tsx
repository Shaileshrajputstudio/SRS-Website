import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { ProductListClient } from "./ProductListClient";
import { LinkButton } from "@/components/admin/ui";
import { PlusIcon } from "@/components/admin/icons";

// Always fetch fresh from the database — this is the CMS's own editing
// list, so it must never show build-time-frozen content.
export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [{ data: products }, { data: categories }] = await Promise.all([
    supabaseAdmin
      .from("products")
      .select("id,slug,display_name,category,placeholder,images")
      .order("sort_order"),
    supabaseAdmin.from("product_categories").select("name").order("sort_order"),
  ]);

  return (
    <div className="max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
        <LinkButton href="/admin/products/new">
          <PlusIcon />
          Add product
        </LinkButton>
      </div>

      <ProductListClient
        products={products ?? []}
        categories={(categories ?? []).map((c) => c.name)}
      />
    </div>
  );
}
