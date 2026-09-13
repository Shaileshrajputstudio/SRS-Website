"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Product, ProductCategory } from "@/data/products";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";

function SearchIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function ProductCategoryBrowser({
  categories,
  products,
}: {
  categories: readonly ProductCategory[];
  products: Product[];
}) {
  // Lets a link like /products?category=Table%20Lights (e.g. from the
  // catalogue-sharing tool) land directly on that tab instead of always
  // opening on the first category. Read once at mount — clicking a tab
  // afterward is still plain client state, same as before.
  const searchParams = useSearchParams();
  const requestedCategory = searchParams.get("category");
  const [active, setActive] = useState<ProductCategory>(
    () => categories.find((c) => c === requestedCategory) ?? categories[0],
  );
  const [query, setQuery] = useState("");
  // A non-empty query searches every product, across every category, not
  // just whichever tab happens to be active — a visitor searching by name
  // shouldn't have to already know (or guess) which category it's filed
  // under first. Clearing the query goes back to the normal tab-filtered
  // browse. Picking a tab while a search is active clears the query (see
  // the tab button below) rather than leaving a stale search "on" behind
  // a category that no longer reflects it.
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      products.filter((p) => {
        if (!normalizedQuery) return p.category === active;
        return (
          p.displayName.toLowerCase().includes(normalizedQuery) ||
          p.romanized.toLowerCase().includes(normalizedQuery) ||
          p.series.toLowerCase().includes(normalizedQuery) ||
          p.category.toLowerCase().includes(normalizedQuery)
        );
      }),
    [products, active, normalizedQuery],
  );

  return (
    <div>
      <div className="mx-auto flex max-w-[1800px] flex-col gap-4 px-6 pt-8 pb-6 sm:flex-row sm:items-end sm:justify-between sm:px-10 sm:pt-10 lg:px-16">
        <div>
          <RevealText as="h1" className="text-2xl sm:text-3xl">
            The Objects
          </RevealText>
          <Reveal delay={0.05}>
            <p className="font-sans-ui mt-2 text-sm text-[var(--ink)]/60">
              Made to order, browse by type below.
            </p>
          </Reveal>
        </div>
        <div className="relative w-full sm:w-72">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[var(--ink)]/40" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all products…"
            aria-label="Search all products"
            className="font-sans-ui w-full rounded-full border border-[var(--line)] bg-[var(--paper)] py-2.5 pr-4 pl-10 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--ink)]"
          />
        </div>
      </div>

      <div className="font-sans-ui sticky top-[73px] z-10 overflow-x-auto border-y border-[var(--line)] bg-[var(--paper)]/95 backdrop-blur sm:top-[81px]">
        <div className="mx-auto flex max-w-[1800px] gap-1 px-6 sm:px-10 lg:px-16 py-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setActive(category);
                setQuery("");
              }}
              className={`shrink-0 px-4 py-3 text-sm whitespace-nowrap transition ${
                active === category && !normalizedQuery
                  ? "bg-[var(--ink)] text-white"
                  : "text-[var(--ink)]/60 hover:text-[var(--ink)]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1800px] px-6 sm:px-10 lg:px-16 pt-12 pb-28">
        {filtered.length === 0 ? (
          <p className="py-16 text-center text-[var(--ink)]/50">
            {normalizedQuery
              ? `No products match "${query.trim()}".`
              : "More pieces from this category are on their way."}
          </p>
        ) : (
          <Reveal
            as="div"
            staggerChildren
            stagger={0.06}
            duration={0.6}
            key={normalizedQuery ? "search" : active}
            className="grid grid-cols-1 gap-x-6 gap-y-20 sm:grid-cols-2 lg:grid-cols-4"
          >
            {filtered.map((product) => (
              <Link key={product.slug} href={`/products/${product.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-[var(--paper-2)]">
                  <Image
                    src={product.images[0]}
                    alt={product.placeholder ? `${product.category} — coming soon` : product.romanized}
                    fill
                    unoptimized
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <p className="font-sans-ui mt-4 text-center text-sm tracking-[0.05em] text-[var(--ink)]">
                  {product.placeholder ? (
                    <>‖ {product.category} ‖</>
                  ) : (
                    <>‖ {product.displayName} ‖</>
                  )}
                </p>
                {!product.placeholder && product.romanized !== product.displayName && (
                  <p className="font-sans-ui mt-1 text-center text-xs text-[var(--ink)]/50">
                    ({product.romanized})
                  </p>
                )}
              </Link>
            ))}
          </Reveal>
        )}
      </div>
    </div>
  );
}
