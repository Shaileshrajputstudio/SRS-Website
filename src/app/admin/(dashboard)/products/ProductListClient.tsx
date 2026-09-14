"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { deleteProduct } from "./actions";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Input, Select, Card, Badge, Button } from "@/components/admin/ui";
import { SearchIcon, ImageIcon } from "@/components/admin/icons";

type Row = {
  id: string;
  slug: string;
  display_name: string;
  category: string;
  placeholder: boolean;
  images: string[];
};

const PAGE_SIZE = 20;

export function ProductListClient({ products, categories }: { products: Row[]; categories: string[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (category && p.category !== category) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return p.display_name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
    });
  }, [products, query, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [query, category]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search products…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-56 pl-9"
          />
        </div>
        <Select value={category} onChange={(e) => setCategory(e.target.value)} className="w-48">
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>
        <span className="text-xs text-gray-400">{filtered.length} of {products.length}</span>
      </div>

      <Card className="divide-y divide-gray-100">
        {paged.map((p, i) => (
          <div key={p.id} className="flex items-center gap-4 px-4 py-3">
            <span className="w-6 shrink-0 text-right text-xs tabular-nums text-gray-300">
              {(page - 1) * PAGE_SIZE + i + 1}
            </span>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-50">
              {p.images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
              ) : (
                <ImageIcon className="h-5 w-5 text-gray-300" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 truncate text-sm font-medium text-gray-900">
                {p.display_name}
                {p.placeholder && <Badge>Placeholder</Badge>}
              </p>
              <p className="truncate text-xs text-gray-400">{p.category} · {p.slug}</p>
            </div>
            <Link
              href={`/admin/products/${p.id}`}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
            >
              Edit
            </Link>
            <DeleteButton
              action={deleteProduct.bind(null, p.id)}
              confirmText={`Delete "${p.display_name}"? This can't be undone.`}
            />
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-gray-400">No products match.</p>
        )}
      </Card>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            className="px-2.5 py-1.5 text-xs"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
              className={`h-8 w-8 rounded-lg text-xs font-medium transition ${
                n === page
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {n}
            </button>
          ))}
          <Button
            type="button"
            variant="ghost"
            className="px-2.5 py-1.5 text-xs"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
