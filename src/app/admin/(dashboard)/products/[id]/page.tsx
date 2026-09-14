import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { ProductForm } from "../ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [{ data: product }, { data: categories }, { data: collections }, { data: elements }] = await Promise.all([
    supabaseAdmin.from("products").select("*").eq("id", id).maybeSingle(),
    supabaseAdmin.from("product_categories").select("name").order("sort_order"),
    supabaseAdmin.from("collections").select("title").neq("slug", "panch-bhuta").order("sort_order"),
    supabaseAdmin.from("elements").select("title").order("sort_order"),
  ]);

  if (!product) notFound();

  const stories = [...(collections ?? []).map((c) => c.title), ...(elements ?? []).map((e) => e.title)];

  return <ProductForm product={product} categories={(categories ?? []).map((c) => c.name)} stories={stories} />;
}
