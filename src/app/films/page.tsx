import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ArrowIcon } from "@/components/ArrowIcon";
import { FilmThumb } from "@/components/FilmThumb";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { getPanchBhuta, getElements, getStoryCollections, filmPoster } from "@/data/collections";

export const metadata: Metadata = {
  title: "Films",
  description: "The storytelling archive, every film made for Shailesh Rajput Studio, in one place.",
};

export default async function FilmsPage() {
  const [panchBhuta, elements, storyCollections] = await Promise.all([
    getPanchBhuta(),
    getElements(),
    getStoryCollections(),
  ]);

  // Only list a category here if it has at least one real, playable film —
  // several of the six elements currently have nothing but placeholder
  // entries (no videoSrc), and showing an empty-feeling group of "coming
  // soon" posters isn't what an archive page should lead with.
  const filmGroups = [
    { slug: panchBhuta.slug, title: panchBhuta.title, href: "/collections/panch-bhuta", films: panchBhuta.films },
    ...elements.map((el) => ({ slug: el.slug, title: el.title, href: "/collections/panch-bhuta", films: el.films })),
    ...storyCollections.map((c) => ({ slug: c.slug, title: c.title, href: `/collections/${c.slug}`, films: c.films })),
  ].filter((g) => g.films.some((film) => film.videoSrc));

  return (
    <>
      <Nav />

      <section className="mx-auto max-w-3xl px-6 pt-20 pb-16 text-center sm:pt-28">
        <Reveal>
          <p className="font-sans-ui mb-4 flex items-center justify-center gap-2 text-xs tracking-[0.2em] text-[var(--ash)] uppercase">
            Films
          </p>
        </Reveal>
        <RevealText as="h1" className="mb-6 text-4xl leading-tight sm:text-5xl">
          The storytelling archive.
        </RevealText>
        <Reveal delay={0.05}>
          <p className="text-[var(--ink)]/70 leading-relaxed">
            Every film made for the brand, in one place, origin films,
            process films, and pieces seen in situ.
          </p>
        </Reveal>
      </section>

      <div className="mx-auto max-w-[1800px] px-6 sm:px-10 lg:px-16 pb-24">
        {filmGroups.map((g, i) => (
          <section
            key={g.slug}
            className={`mb-16 ${i > 0 ? "border-t border-[#D6CEB5] pt-16" : ""}`}
          >
            <div className="mb-6 flex items-baseline justify-between">
              <h2 className="text-xl">{g.title}</h2>
              <Link
                href={g.href}
                className="font-sans-ui inline-flex items-center gap-1.5 text-base text-[var(--ink)]/60 hover:text-[var(--ink)]"
              >
                View collection
                <ArrowIcon className="h-3.5 w-3.5" />
              </Link>
            </div>
            <Reveal
              as="div"
              staggerChildren
              className="grid grid-cols-2 justify-items-center gap-4 sm:grid-cols-4 lg:grid-cols-6"
            >
              {g.films.map((film) =>
                film.videoSrc ? (
                  <FilmThumb
                    key={film.slug}
                    film={film as typeof film & { videoSrc: string }}
                    poster={filmPoster(film)}
                  />
                ) : (
                  <div
                    key={film.slug}
                    className="group relative mx-auto w-full max-w-[180px] overflow-hidden rounded-2xl bg-[var(--ink)]"
                  >
                    <div className="relative aspect-[9/16] overflow-hidden">
                      <Image
                        src={filmPoster(film)}
                        alt={film.title}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                      <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-black/70 to-transparent px-3 pt-3 pb-8 text-white">
                        <p className="text-sm">{film.title}</p>
                        <p className="font-sans-ui text-xs text-white/70">
                          {film.type} · {film.duration}
                        </p>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </Reveal>
          </section>
        ))}
      </div>

      <Footer />
    </>
  );
}
