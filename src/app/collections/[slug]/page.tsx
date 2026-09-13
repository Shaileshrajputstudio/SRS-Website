import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ArrowIcon } from "@/components/ArrowIcon";
import { FilmThumb } from "@/components/FilmThumb";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { Magnetic } from "@/components/motion/Magnetic";
import {
  coverImage,
  filmPoster,
  getCollectionBySlug,
  getStoryCollections,
} from "@/data/collections";
import { getProductsBySeries } from "@/data/products";

export async function generateStaticParams() {
  return getStoryCollections().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) return {};

  return {
    title: collection.title,
    description: collection.myth,
    openGraph: {
      title: `${collection.title} — ${collection.sanskritName}`,
      description: collection.myth,
      images: [{ url: coverImage(collection) }],
    },
  };
}

export default async function CollectionChapterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const stories = getStoryCollections();
  const collection = getCollectionBySlug(slug);
  if (!collection || slug === "panch-bhuta") notFound();

  const index = stories.findIndex((c) => c.slug === slug);
  const next = stories[(index + 1) % stories.length];
  const seriesProducts = getProductsBySeries(collection.title);

  return (
    <>
      <Nav />

      <Reveal
        as="section"
        variant="image"
        className="relative flex h-[57.6vh] min-h-[346px] items-end overflow-hidden"
      >
        <Image
          src={coverImage(collection)}
          alt={collection.title}
          fill
          priority
          unoptimized
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />
        <div className="relative z-10 mx-auto w-full max-w-[1800px] px-6 sm:px-10 lg:px-16 pb-14 text-white">
          <p className="font-sans-ui mb-3 text-xs tracking-[0.2em] uppercase text-white/80">
            Story {String(index + 1).padStart(2, "0")} · {collection.sanskritName}
          </p>
          <h1 className="text-4xl sm:text-6xl">{collection.title}</h1>
          <p className="font-sans-ui mt-2 text-lg text-white/70">{collection.sanskritName}</p>
        </div>
      </Reveal>

      <section className="mx-auto max-w-[833px] px-6 py-20 text-center">
        <Reveal>
          <p className="font-sans-ui mb-4 text-xs tracking-[0.2em] text-[var(--ash)] uppercase">
            The Myth
          </p>
        </Reveal>
        <RevealText as="p" className="text-2xl leading-relaxed sm:text-3xl">
          {collection.myth}
        </RevealText>
      </section>

      <section className="mx-auto max-w-[1800px] px-6 sm:px-10 lg:px-16 pb-20">
        <Reveal as="div" staggerChildren className="flex flex-wrap justify-center gap-4">
          {collection.films.map((film) =>
            film.videoSrc ? (
              <FilmThumb
                key={film.slug}
                film={film as typeof film & { videoSrc: string }}
                poster={filmPoster(film)}
              />
            ) : (
              <Link
                key={film.slug}
                href="/films"
                className="group relative block w-full max-w-[180px] overflow-hidden rounded-2xl"
              >
                <div className="relative aspect-[9/16] overflow-hidden bg-[var(--ink)]">
                  <Image
                    src={filmPoster(film)}
                    alt={film.title}
                    fill
                    unoptimized
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-black/70 to-transparent px-3 pt-3 pb-8 text-white">
                    <p className="text-sm">{film.title}</p>
                    <p className="font-sans-ui text-xs text-white/70">
                      {film.type} · {film.duration}
                    </p>
                  </div>
                </div>
              </Link>
            ),
          )}
        </Reveal>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="font-sans-ui mb-4 text-xs tracking-[0.2em] text-[var(--ash)] uppercase">
              The Material Story
            </p>
          </Reveal>
          <RevealText as="p" className="text-xl leading-relaxed sm:text-2xl">
            {collection.materialStory}
          </RevealText>
        </div>
      </section>

      {seriesProducts.length > 0 && (
        <section className="mx-auto max-w-[1800px] border-t border-[var(--line)] px-6 sm:px-10 lg:px-16 py-20">
          <Reveal>
            <p className="font-sans-ui mb-8 text-xs tracking-[0.2em] text-[var(--ash)] uppercase">
              Products in This Collection
            </p>
          </Reveal>
          <Reveal as="div" staggerChildren className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {seriesProducts.map((product) => (
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
                <p className="font-sans-ui mt-1 text-center text-xs text-[var(--ink)]/50">
                  ({product.romanized})
                </p>
              </Link>
            ))}
          </Reveal>
        </section>
      )}

      <section className="border-t border-[var(--line)] bg-[var(--ink)] px-6 py-20 text-center text-white">
        <Reveal>
          <p className="font-sans-ui mb-4 text-xs tracking-[0.2em] uppercase text-white/60">
            {collection.title} is available on request
          </p>
        </Reveal>
        <RevealText as="h2" className="mx-auto mb-8 max-w-xl text-3xl leading-snug sm:text-4xl">
          Every piece is presented the way collectible art is presented.
          Begin a conversation with the studio.
        </RevealText>
        <Reveal delay={0.1} className="inline-block">
          <Magnetic>
            <Link
              href={`/acquire?collection=${collection.slug}`}
              className="font-sans-ui inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-[var(--ink)] transition hover:bg-[var(--accent)]"
            >
              Begin a Conversation
            </Link>
          </Magnetic>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1800px] px-6 sm:px-10 lg:px-16 py-14">
        <Reveal>
          <Link href={`/collections/${next.slug}`} className="group flex items-center justify-between">
            <div>
              <p className="font-sans-ui mb-1 text-xs tracking-[0.2em] text-[var(--ash)] uppercase">
                Next Collection
              </p>
              <p className="text-2xl group-hover:text-[var(--accent)]">{next.title}</p>
            </div>
            <span className="text-[var(--ink)]/40 transition group-hover:translate-x-1 group-hover:text-[var(--ink)]">
              <ArrowIcon className="h-6 w-6" />
            </span>
          </Link>
        </Reveal>
      </section>

      <Footer />
    </>
  );
}
