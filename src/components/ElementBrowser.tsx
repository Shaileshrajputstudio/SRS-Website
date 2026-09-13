"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Element } from "@/data/collections";
import type { Product } from "@/data/products";

export function ElementBrowser({
  elements,
  productsByElement,
}: {
  elements: Element[];
  productsByElement: Record<string, Product[]>;
}) {
  const [active, setActive] = useState(elements[0].slug);
  const activeElement = elements.find((e) => e.slug === active)!;
  const products = productsByElement[active] ?? [];

  return (
    <div>
      <div className="font-sans-ui mb-10 overflow-x-auto border-y border-[var(--line)]">
        <div className="mx-auto flex max-w-[1800px] gap-1 px-6 sm:px-10 lg:px-16 py-1">
          {elements.map((el) => (
            <button
              key={el.slug}
              onClick={() => setActive(el.slug)}
              className={`shrink-0 px-4 py-3 text-sm whitespace-nowrap transition ${
                active === el.slug
                  ? "bg-[var(--ink)] text-white"
                  : "text-[var(--ink)]/60 hover:text-[var(--ink)]"
              }`}
            >
              {el.title}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1800px] px-6 sm:px-10 lg:px-16">
        <div className="mb-10 max-w-2xl">
          <p className="font-sans-ui mb-2 text-xs tracking-[0.2em] text-[var(--ash)] uppercase">
            {activeElement.sanskritName} · {activeElement.element}
          </p>
          <p className="leading-relaxed text-[var(--ink)]/80">{activeElement.myth}</p>
        </div>

        {products.length === 0 ? (
          <p className="py-16 text-center text-[var(--ink)]/50">
            More products from {activeElement.title} are on their way.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 pb-20 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <Link key={product.slug} href={`/products/${product.slug}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden bg-[var(--paper-2)]">
                  <Image
                    src={product.images[0]}
                    alt={product.romanized}
                    fill
                    unoptimized
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <p className="font-sans-ui mt-4 text-center text-sm tracking-[0.05em] text-[var(--ink)]">
                  ‖ {product.displayName} ‖
                </p>
                {product.romanized !== product.displayName && (
                  <p className="font-sans-ui mt-1 text-center text-xs text-[var(--ink)]/50">
                    {product.romanized}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
