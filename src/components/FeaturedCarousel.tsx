"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { Marquee } from "@/components/motion/Marquee";

// A slow, continuously moving strip rather than a paged carousel — driven
// by <Marquee> (GSAP + a touch of scroll-speed reactivity), which pauses
// on hover so a visitor can linger on a piece.
export function FeaturedCarousel({ products }: { products: Product[] }) {
  return (
    <Marquee
      items={products}
      keyFor={(product, i) => `${product.slug}-${i}`}
      renderItem={(product) => (
        <Link href={`/products/${product.slug}`} className="group block w-[220px] shrink-0 sm:w-[280px]">
          <div className="mb-3 aspect-[3/4] overflow-hidden bg-[var(--paper-2)]">
            <Image
              src={product.images[0]}
              alt={product.romanized}
              width={900}
              height={1200}
              unoptimized
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
          <p className="text-lg">‖ {product.displayName} ‖</p>
          {product.romanized !== product.displayName && (
            <p className="font-sans-ui text-xs tracking-[0.15em] text-[var(--ash)] uppercase">
              {product.romanized}
            </p>
          )}
        </Link>
      )}
    />
  );
}
