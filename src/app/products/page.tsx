import type { Metadata } from "next";
import { Suspense } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ProductCategoryBrowser } from "@/components/ProductCategoryBrowser";
import { getAllProducts, getProductCategories } from "@/data/products";

export const metadata: Metadata = {
  title: "Shop by Series",
  description: "Browse Shailesh Rajput Studio's work by category, wall sconces, pendant lights, floor lamps, and more.",
};

export default async function ProductsPage() {
  const [products, productCategories] = await Promise.all([getAllProducts(), getProductCategories()]);

  return (
    <>
      <Nav />

      {/* Title/subtitle live inside ProductCategoryBrowser now, alongside
          the search input in the same row — both need the client-side
          category/search state, so they moved together. */}
      <Suspense fallback={null}>
        <ProductCategoryBrowser categories={productCategories} products={products} />
      </Suspense>

      <Footer />
    </>
  );
}
