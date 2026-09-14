"use client";

import { useMemo, useState } from "react";
import { Input, Card } from "@/components/admin/ui";
import { XIcon } from "@/components/admin/icons";

type ProductOption = { slug: string; displayName: string };

// A search-and-add list rather than a giant checkbox list (there are ~100
// products) — type to find one, click to add it to the end. No drag
// reordering for now; remove + re-add is enough to reorder for a list
// that changes rarely. Order is what the homepage carousel uses.
export function FeaturedProductsPicker({
  allProducts,
  initialSlugs,
}: {
  allProducts: ProductOption[];
  initialSlugs: string[];
}) {
  const [selected, setSelected] = useState<string[]>(initialSlugs);
  const [query, setQuery] = useState("");

  const bySlug = useMemo(() => new Map(allProducts.map((p) => [p.slug, p])), [allProducts]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allProducts
      .filter((p) => !selected.includes(p.slug))
      .filter((p) => p.displayName.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q))
      .slice(0, 8);
  }, [allProducts, selected, query]);

  function add(slug: string) {
    setSelected((prev) => [...prev, slug]);
    setQuery("");
  }

  function remove(slug: string) {
    setSelected((prev) => prev.filter((s) => s !== slug));
  }

  return (
    <div>
      {selected.map((slug) => (
        <input key={slug} type="hidden" name="featuredProductSlugs" value={slug} />
      ))}

      {selected.length > 0 && (
        <Card className="mb-3 divide-y divide-gray-100">
          {selected.map((slug, i) => (
            <div key={slug} className="flex items-center gap-3 px-4 py-2.5 text-sm">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-gray-100 text-xs font-medium text-gray-500">
                {i + 1}
              </span>
              <span className="flex-1 text-gray-900">{bySlug.get(slug)?.displayName ?? slug}</span>
              <button
                type="button"
                onClick={() => remove(slug)}
                className="rounded p-1 text-gray-300 transition hover:bg-red-50 hover:text-red-600"
                aria-label="Remove"
              >
                <XIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </Card>
      )}

      <div className="relative">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products to add…"
        />
        {results.length > 0 && (
          <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
            {results.map((p) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => add(p.slug)}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                {p.displayName}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
