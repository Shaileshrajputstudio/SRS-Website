"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// A plain-data shape (no functions — this is a Client Component, so props
// crossing from the server page must be serializable) describing one story
// tile: the fields the fan needs to render, with its cover image already
// resolved by the caller.
export type StoryTile = {
  slug: string;
  title: string;
  sanskritName: string;
  myth: string;
  elementsCount?: number;
  image: string;
};

// The six stories used to be a plain 2-row image grid — real estate-heavy
// (Shailesh's own feedback) for what's really just a set of entry points
// into /collections. This replaces it with a single-row "fan" of panels,
// like books on a shelf: each collapses to a vertical spine label and
// expands on hover/focus to reveal the cover image, Sanskrit name, and a
// line of the myth. One row's height instead of two, and a genuinely
// different interaction from the marquee directly above it on the page.
// Falls back to a horizontally-scrolling shelf below `sm`, where hover
// doesn't exist and narrow spines wouldn't work.
export function StoriesFan({ stories }: { stories: StoryTile[] }) {
  const [active, setActive] = useState(0);

  return (
    <>
      <div className="hidden h-[520px] gap-2 sm:flex">
        {stories.map((c, i) => {
          const isActive = active === i;
          return (
            <Link
              key={c.slug}
              href={`/collections/${c.slug}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="group relative overflow-hidden transition-[flex-grow] duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ flexGrow: isActive ? 6 : 1, flexBasis: 0, minWidth: 0 }}
            >
              <Image
                src={c.image}
                alt={c.title}
                fill
                unoptimized
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/25" />

              {/* Collapsed: a vertical spine label */}
              <div
                className={`absolute inset-0 flex items-end justify-center pb-6 transition-opacity duration-700 ${
                  isActive ? "opacity-0" : "opacity-100"
                }`}
              >
                <p className="vertical-text font-sans-ui text-xs tracking-[0.2em] whitespace-nowrap text-white uppercase">
                  {c.title}
                </p>
              </div>

              {/* Expanded: full caption */}
              <div
                className={`absolute inset-0 flex flex-col justify-end p-6 text-white transition-opacity duration-700 ${
                  isActive ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              >
                <p className="font-sans-ui mb-2 text-xs tracking-[0.15em] whitespace-nowrap text-white/70 uppercase">
                  {c.sanskritName}
                  {!c.elementsCount && " · Story Series"}
                </p>
                <p className="mb-2 text-2xl leading-tight">{c.title}</p>
                <p className="line-clamp-2 max-w-xs text-sm text-white/80">{c.myth}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="scrollbar-none flex gap-4 overflow-x-auto pb-2 sm:hidden">
        {stories.map((c) => (
          <Link
            key={c.slug}
            href={`/collections/${c.slug}`}
            className="group block w-[220px] shrink-0"
          >
            <div className="mb-3 aspect-[4/5] overflow-hidden">
              <Image
                src={c.image}
                alt={c.title}
                width={440}
                height={550}
                unoptimized
                className="h-full w-full object-cover"
              />
            </div>
            <p className="text-lg">{c.title}</p>
            <p className="font-sans-ui text-xs tracking-[0.15em] text-[var(--ash)] uppercase">
              {c.sanskritName}
              {!c.elementsCount && " · Story Series"}
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}
