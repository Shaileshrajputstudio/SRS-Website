import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ArrowIcon } from "@/components/ArrowIcon";
import { FilmThumb } from "@/components/FilmThumb";
import { getPanchBhuta, getElements, coverImage, filmPoster } from "@/data/collections";
import { getProductsBySeries } from "@/data/products";
import { ElementBrowser } from "@/components/ElementBrowser";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";

export const metadata: Metadata = {
  title: "Panch Bhuta",
  description: "Panch Bhuta, the studio's six elemental principles: Bhumi, Jal, Agni, Vayu, Vyom, and Dhatu.",
};

export default async function PanchBhutaPage() {
  const [panchBhuta, elements] = await Promise.all([getPanchBhuta(), getElements()]);
  const productsByElement = Object.fromEntries(
    await Promise.all(elements.map(async (el) => [el.slug, await getProductsBySeries(el.title)] as const)),
  );

  return (
    <>
      <Nav />

      <Reveal
        as="section"
        variant="image"
        className="relative flex h-[50.4vh] min-h-[302px] items-end overflow-hidden"
      >
        <Image
          src={coverImage(panchBhuta)}
          alt={panchBhuta.title}
          fill
          priority
          unoptimized
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />
        <div className="relative z-10 mx-auto w-full max-w-[1800px] px-6 sm:px-10 lg:px-16 pb-14 text-white">
          <p className="font-sans-ui mb-3 text-xs tracking-[0.2em] uppercase text-white/80">
            The Main Stories · Six Elements
          </p>
          <h1 className="text-4xl sm:text-6xl">{panchBhuta.title}</h1>
          <p className="font-sans-ui mt-2 text-lg text-white/70">{panchBhuta.sanskritName}</p>
        </div>
      </Reveal>

      <section className="mx-auto max-w-[833px] px-6 py-20 text-center">
        <Reveal>
          <p className="font-sans-ui mb-4 text-xs tracking-[0.2em] text-[var(--ash)] uppercase">
            The Myth
          </p>
        </Reveal>
        <RevealText as="p" className="text-2xl leading-relaxed sm:text-3xl">
          {panchBhuta.myth}
        </RevealText>
      </section>

      {panchBhuta.films.length > 0 && (
        <section className="mx-auto max-w-[1800px] px-6 sm:px-10 lg:px-16 pb-20">
          <Reveal as="div" staggerChildren className="flex flex-wrap justify-center gap-4">
            {panchBhuta.films.map((film) => (
              <FilmThumb
                key={film.slug}
                film={film as typeof film & { videoSrc: string }}
                poster={filmPoster(film)}
              />
            ))}
          </Reveal>
        </section>
      )}

      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="font-sans-ui mb-4 text-xs tracking-[0.2em] text-[var(--ash)] uppercase">
              The Material Story
            </p>
          </Reveal>
          <RevealText as="p" className="text-xl leading-relaxed sm:text-2xl">
            {panchBhuta.materialStory}
          </RevealText>
        </div>
      </section>

      <section className="border-t border-[var(--line)] pt-20">
        <div className="mx-auto mb-8 max-w-[1800px] px-6 sm:px-10 lg:px-16">
          <Reveal>
            <p className="font-sans-ui mb-2 text-xs tracking-[0.2em] text-[var(--ash)] uppercase">
              The Six Elements
            </p>
          </Reveal>
          <RevealText as="h2" className="text-3xl sm:text-4xl">
            Find your element.
          </RevealText>
        </div>
        <ElementBrowser elements={elements} productsByElement={productsByElement} />
      </section>

      <section className="mx-auto max-w-[1800px] px-6 sm:px-10 lg:px-16 py-14">
        <Reveal>
          <Link href="/collections" className="group flex items-center justify-between">
            <div>
              <p className="font-sans-ui mb-1 text-xs tracking-[0.2em] text-[var(--ash)] uppercase">
                Back to
              </p>
              <p className="text-2xl group-hover:text-[var(--accent)]">All Collections</p>
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
