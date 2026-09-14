import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { ProductForm } from "../ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const [{ data: categories }, { data: collections }, { data: elements }] = await Promise.all([
    supabaseAdmin.from("product_categories").select("name").order("sort_order"),
    supabaseAdmin.from("collections").select("title").neq("slug", "panch-bhuta").order("sort_order"),
    supabaseAdmin.from("elements").select("title").order("sort_order"),
  ]);
  const stories = [...(collections ?? []).map((c) => c.title), ...(elements ?? []).map((e) => e.title)];

  return <ProductForm categories={(categories ?? []).map((c) => c.name)} stories={stories} />;
}
