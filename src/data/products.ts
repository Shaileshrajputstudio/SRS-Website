import "server-only";
import { supabasePublic } from "@/lib/supabasePublic";

// Products now live in Supabase, edited through /admin/products — this
// file is just the typed read layer the public pages use, matching the
// shape the site's components were originally built against. See
// supabase/schema.sql for the actual table definitions and
// scripts/migrate.ts for how the original hardcoded catalogue became rows.
export type ProductCategory = string;

export type Product = {
  slug: string;
  displayName: string;
  romanized: string;
  series: string;
  category: ProductCategory;
  placeholder: boolean;
  about: string[];
  closing: string[];
  details: {
    productCode: string;
    material: string;
    dimensions: { height: string; width: string; depth: string };
    weight: string;
    leadTime: string;
  };
  images: string[];
};

type ProductRow = {
  slug: string;
  display_name: string;
  romanized: string;
  series: string;
  category: string;
  placeholder: boolean;
  about: string[] | null;
  closing: string[] | null;
  product_code: string;
  material: string;
  dim_height: string;
  dim_width: string;
  dim_depth: string;
  weight: string;
  lead_time: string;
  images: string[] | null;
};

function mapProduct(row: ProductRow): Product {
  return {
    slug: row.slug,
    displayName: row.display_name,
    romanized: row.romanized,
    series: row.series,
    category: row.category,
    placeholder: row.placeholder,
    about: row.about ?? [],
    closing: row.closing ?? [],
    details: {
      productCode: row.product_code,
      material: row.material,
      dimensions: { height: row.dim_height, width: row.dim_width, depth: row.dim_depth },
      weight: row.weight,
      leadTime: row.lead_time,
    },
    images: row.images ?? [],
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabasePublic.from("products").select("*").order("sort_order");
  if (error) throw error;
  return (data ?? []).map(mapProduct);
}

export async function getProductCategories(): Promise<string[]> {
  const { data, error } = await supabasePublic
    .from("product_categories")
    .select("name")
    .order("sort_order");
  if (error) throw error;
  return (data ?? []).map((c) => c.name);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const { data, error } = await supabasePublic
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? mapProduct(data) : undefined;
}

// Real (non-placeholder) products whose `series` matches a story
// collection's title — e.g. MAR:GA's series "Parth:Sarathi" links it to the
// Parth:Sarathi collection page.
export async function getProductsBySeries(series: string): Promise<Product[]> {
  const { data, error } = await supabasePublic
    .from("products")
    .select("*")
    .eq("series", series)
    .eq("placeholder", false)
    .order("sort_order");
  if (error) throw error;
  return (data ?? []).map(mapProduct);
}
