import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { IntroLoader } from "@/components/IntroLoader";
import { ArrowIcon } from "@/components/ArrowIcon";
import { SrsIcon } from "@/components/SrsIcon";
import { Hero } from "@/components/Hero";
import { FeaturedCarousel } from "@/components/FeaturedCarousel";
import { StoriesFan } from "@/components/StoriesFan";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { Magnetic } from "@/components/motion/Magnetic";
import { collections, coverImage } from "@/data/collections";
import { getProductBySlug } from "@/data/products";
import { pressEntries } from "@/data/press";

// A curated set of real, photographed pieces spanning the catalogue's
// breadth — the homepage's entry point into the full product range.
const featuredSlugs = [
  "trivik",
  "sambhu-textured",
  "swarnita",
  "bodhi-deep-samuha",
  "aatrey-flower",
  "manas",
  "pravala",
  "ant-light-bada",
  "eraya-iv",
  "dhaarana",
];
const featuredProducts = featuredSlugs.map((slug) => getProductBySlug(slug)!).filter(Boolean);

// StoriesFan is a Client Component, so its props must be plain, serializable
// data — resolve each collection's cover image here on the server first.
const storyTiles = collections.map((c) => ({
  slug: c.slug,
  title: c.title,
  sanskritName: c.sanskritName,
  myth: c.myth,
  elementsCount: c.elements?.length,
  image: coverImage(c),
}));

export default function ArrivalPage() {
  return (
    <>
      <IntroLoader />
      <Nav />

      <Hero />

      <section className="mx-auto max-w-3xl px-6 pt-24 pb-24 text-center sm:pt-32 sm:pb-32">
        <Reveal>
          <p className="font-sans-ui mb-2 text-xs tracking-[0.2em] text-[var(--ash)] uppercase">
            The Studio
          </p>
        </Reveal>
        <RevealText as="h2" className="mb-8 text-3xl leading-snug sm:text-4xl">
          A practice of observation, held by two hands.
        </RevealText>
        <Reveal delay={0.05}>
          <p className="mb-5 leading-relaxed text-[var(--ink)]/70">
            The purest expression of an idea, feeling, or experience
            distilled to what truly matters, depth through simplicity,
            meaning through restraint.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mb-5 leading-relaxed text-[var(--ink)]/70">
            Shailesh and Mansi approach design as a process of discovery
            rather than control. Questions arrive before answers. Intuition
            arrives before logic, through sketching, experimentation, and
            making, their observations take shape as objects that invite
            others into the same sense of wonder.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mb-8 leading-relaxed text-[var(--ink)]/70">
            Rooted in looking closely at nature, materials, and the quiet
            details of everyday life, this way of seeing became the
            foundation of Shailesh Rajput Studio, where observation becomes
            form, and design becomes a way of participating in life.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <Link
            href="/world"
            className="font-sans-ui inline-flex items-center gap-1.5 text-base text-[var(--ink)]/60 hover:text-[var(--ink)]"
          >
            Learn more about the studio
            <ArrowIcon className="h-3.5 w-3.5" />
          </Link>
        </Reveal>
      </section>

      <div className="mx-auto max-w-[1800px] px-6 sm:px-10 lg:px-16">
        <div className="border-t border-[#D6CEB5]" />
      </div>

      <section className="mx-auto max-w-[1800px] px-6 sm:px-10 lg:px-16 pb-24 pt-24">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <Reveal>
              <p className="font-sans-ui mb-2 flex items-center gap-2 text-xs tracking-[0.2em] text-[var(--ash)] uppercase">
                Featured Products
              </p>
            </Reveal>
            <RevealText as="h2" className="text-3xl sm:text-4xl">
              A first look at the work.
            </RevealText>
          </div>
          <Link
            href="/products"
            className="font-sans-ui hidden shrink-0 items-center gap-1.5 text-base text-[var(--ink)]/60 hover:text-[var(--ink)] sm:inline-flex"
          >
            View all products
            <ArrowIcon className="h-3.5 w-3.5" />
          </Link>
        </div>

        <Reveal variant="image">
          <FeaturedCarousel products={featuredProducts} />
        </Reveal>

        <Link
          href="/products"
          className="font-sans-ui mt-10 flex items-center justify-center gap-1.5 text-base text-[var(--ink)]/60 hover:text-[var(--ink)] sm:hidden"
        >
          View all products
          <ArrowIcon className="h-3.5 w-3.5" />
        </Link>
      </section>

      <section className="bg-[var(--footer-bg)] px-6 py-28 sm:px-10 sm:py-36 lg:px-16">
        <Reveal className="flex flex-col items-center">
          <SrsIcon className="mb-8 h-12 w-12 text-[var(--accent)]" />
          <p className="mx-auto max-w-2xl text-center text-[21.12px] leading-relaxed sm:text-[26.4px]">
            “I believe every form has a story within it. Our role as
            designers is to find that story, give it shape, and let it
            speak in its own quiet way. And when it leaves the studio, it
            carries more than its form. It carries a thought, an
            intention, and a{" "}
            <span className="text-[var(--accent)]">story</span> waiting to
            be told.”
          </p>
          <p className="font-sans-ui mt-6 text-xs tracking-[0.2em] text-[var(--ink)]/60 uppercase">
            — Shailesh Rajput
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1800px] px-6 sm:px-10 lg:px-16 pt-24 pb-24">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <Reveal>
              <p className="font-sans-ui mb-2 flex items-center gap-2 text-xs tracking-[0.2em] text-[var(--ash)] uppercase">
                The Stories
              </p>
            </Reveal>
            <RevealText as="h2" className="text-3xl sm:text-4xl">
              Six stories, one practice.
            </RevealText>
          </div>
          <Link
            href="/collections"
            className="font-sans-ui hidden shrink-0 items-center gap-1.5 text-base text-[var(--ink)]/60 hover:text-[var(--ink)] sm:inline-flex"
          >
            View all stories
            <ArrowIcon className="h-3.5 w-3.5" />
          </Link>
        </div>

        <Reveal variant="image">
          <StoriesFan stories={storyTiles} />
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1800px] px-6 sm:px-10 lg:px-16 pb-24">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <Reveal>
              <p className="font-sans-ui mb-2 flex items-center gap-2 text-xs tracking-[0.2em] text-[var(--ash)] uppercase">
                Exhibitions &amp; Press
              </p>
            </Reveal>
            <RevealText as="h2" className="text-3xl sm:text-4xl">
              In the world.
            </RevealText>
          </div>
          <Link
            href="/press"
            className="font-sans-ui hidden shrink-0 items-center gap-1.5 text-base text-[var(--ink)]/60 hover:text-[var(--ink)] sm:inline-flex"
          >
            View all news
            <ArrowIcon className="h-3.5 w-3.5" />
          </Link>
        </div>

        <Reveal as="div" staggerChildren className="grid grid-cols-2 gap-x-10 gap-y-16 sm:grid-cols-4">
          {pressEntries
            .filter((entry) => entry.category === "Press" && !entry.placeholder)
            .slice(0, 4)
            .map((entry, i) => (
              <Link
                key={entry.title + i}
                href={entry.url ?? "/press"}
                target={entry.url ? "_blank" : undefined}
                rel={entry.url ? "noopener noreferrer" : undefined}
                className="group block"
              >
                {entry.logo ? (
                  <div className="mb-4 flex aspect-[4/3] items-center justify-center bg-[var(--footer-bg)] p-6 sm:aspect-square">
                    <Image
                      src={entry.logo}
                      alt={`${entry.venue} logo`}
                      width={300}
                      height={300}
                      unoptimized
                      className="h-full w-full scale-[0.84] object-contain transition duration-500 group-hover:scale-[0.882]"
                    />
                  </div>
                ) : (
                  <div className="mb-4 aspect-[4/3] overflow-hidden bg-[var(--paper-2)] sm:aspect-square">
                    <Image
                      src={entry.image ?? `/images/press/press-${(i % 3) + 1}.svg`}
                      alt={entry.title}
                      width={300}
                      height={300}
                      unoptimized
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <p className="font-sans-ui mb-1 text-xs tracking-[0.15em] text-[var(--ash)] uppercase">
                  {entry.venue}
                </p>
                <p className="text-lg leading-snug transition group-hover:text-[var(--accent)]">
                  {entry.title}
                </p>
              </Link>
            ))}
        </Reveal>

        <Link
          href="/press"
          className="font-sans-ui mt-10 flex items-center justify-center gap-1.5 text-base text-[var(--ink)]/60 hover:text-[var(--ink)] sm:hidden"
        >
          View all news
          <ArrowIcon className="h-3.5 w-3.5" />
        </Link>
      </section>

      <section className="border-t border-[var(--line)] bg-[var(--ink)] px-6 py-24 text-center text-white">
        <Reveal>
          <p className="font-sans-ui mb-4 text-xs tracking-[0.2em] uppercase text-white/60">
            The World We Are Building
          </p>
        </Reveal>
        <RevealText
          as="h2"
          className="mx-auto mb-8 max-w-2xl text-3xl leading-snug sm:text-4xl"
        >
          A place where creators, artisans, thinkers, and curious minds
          gather to exchange ideas and create meaningful work.
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
