import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { Magnetic } from "@/components/motion/Magnetic";
import { getAllCollections, coverImage } from "@/data/collections";

export const metadata: Metadata = {
  title: "Shop by Stories",
  description: "The main stories of Shailesh Rajput Studio, presented as immersive chapters, not SKUs.",
};

export default async function CollectionsPage() {
  const collections = await getAllCollections();

  return (
    <>
      <Nav />

      <section className="mx-auto max-w-3xl px-6 pt-20 pb-16 text-center sm:pt-28">
        <Reveal>
          <p className="font-sans-ui mb-4 flex items-center justify-center gap-2 text-xs tracking-[0.2em] text-[var(--ash)] uppercase">
            The Stories
          </p>
        </Reveal>
        <RevealText as="h1" className="mb-6 text-4xl leading-tight sm:text-5xl">
          Chapters, not SKU lists.
        </RevealText>
        <Reveal delay={0.05}>
          <p className="text-[var(--ink)]/70 leading-relaxed">
            Each collection is presented the way collectible art is
            presented globally, through its myth, its films, its material
            story. Prices are not displayed; every piece is available on
            request.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1800px] px-6 sm:px-10 lg:px-16 pb-24">
        <Reveal as="div" staggerChildren className="grid grid-cols-1 gap-x-10 gap-y-24 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c) => (
            <Link
              key={c.slug}
              href={`/collections/${c.slug}`}
              className="group block"
            >
              <div className="mb-4 aspect-[4/3] overflow-hidden">
                <Image
                  src={coverImage(c)}
                  alt={c.title}
                  width={1000}
                  height={750}
                  unoptimized
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <p className="font-sans-ui mb-2 text-xs tracking-[0.2em] text-[var(--ash)] uppercase">
                {c.sanskritName}
                {c.elements ? ` · ${c.elements.length} Elements` : " · Story Series"}
              </p>
              <h2 className="mb-2 text-xl">{c.title}</h2>
              <p className="text-sm leading-relaxed text-[var(--ink)]/70">{c.myth}</p>
            </Link>
          ))}
        </Reveal>
      </section>

      <section className="border-t border-[var(--line)] bg-[var(--ink)] px-6 py-24 text-center text-white">
        <Reveal>
          <p className="font-sans-ui mb-4 text-xs tracking-[0.2em] uppercase text-white/60">
            Own a Piece of the Story
          </p>
        </Reveal>
        <RevealText as="h2" className="mx-auto mb-8 max-w-2xl text-3xl leading-snug sm:text-4xl">
          Every collection is available to acquire, priced individually,
          and shared only on request.
        </RevealText>
        <Reveal delay={0.1} className="inline-block">
          <Magnetic>
            <Link
              href="/acquire"
              className="font-sans-ui inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-[var(--ink)] transition hover:bg-[var(--accent)]"
            >
              Begin a Conversation
            </Link>
          </Magnetic>
        </Reveal>
      </section>

      <Footer />
    </>
  );
}
