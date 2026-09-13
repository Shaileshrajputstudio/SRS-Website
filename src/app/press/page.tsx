import Image from "next/image";
import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ArrowIcon } from "@/components/ArrowIcon";
import { PressTabs } from "@/components/PressTabs";
import { ExhibitionCard } from "@/components/ExhibitionCard";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { pressEntries } from "@/data/press";

export const metadata: Metadata = {
  title: "Exhibitions & Press",
  description: "Shailesh Rajput Studio's exhibitions, and its work as featured in design publications.",
};

const exhibitionEntries = pressEntries.filter((entry) => entry.category === "Exhibition");
const pressOnlyEntries = pressEntries.filter((entry) => entry.category === "Press");

export default function PressPage() {
  return (
    <>
      <Nav />

      <section className="mx-auto max-w-3xl px-6 pt-12 pb-10 text-center sm:pt-16">
        <Reveal>
          <p className="font-sans-ui mb-3 flex items-center justify-center gap-2 text-xs tracking-[0.2em] text-[var(--ash)] uppercase">
            Exhibitions &amp; Press
          </p>
        </Reveal>
        <RevealText as="h1" className="mb-3 text-4xl leading-tight sm:text-5xl">
          Featured in the world.
        </RevealText>
        <Reveal delay={0.05}>
          <p className="text-[var(--ink)]/70 leading-relaxed">
            Where the studio has shown its work in person, and how design
            publications have covered it, profiles, projects, and features
            from around the world.
          </p>
        </Reveal>
      </section>

      <div className="mx-auto max-w-5xl px-6 pb-24">
        <PressTabs
          exhibitions={
            <Reveal as="div" staggerChildren className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {exhibitionEntries.map((entry, i) => (
                <ExhibitionCard
                  key={entry.title + i}
                  entry={entry}
                  thumbnailSrc={entry.image ?? `/images/press/press-${(i % 3) + 1}.svg`}
                />
              ))}
            </Reveal>
          }
          press={
            <Reveal as="div" staggerChildren className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
              {pressOnlyEntries.map((entry, i) => {
                const Wrapper = entry.url ? "a" : "div";
                return (
                  <Wrapper
                    key={entry.title + i}
                    {...(entry.url
                      ? { href: entry.url, target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="group grid grid-cols-1 items-center gap-6 py-8 sm:grid-cols-[140px_1fr]"
                  >
                    {entry.logo ? (
                      <div className="flex aspect-[4/3] items-center justify-center bg-[var(--footer-bg)] p-6 sm:aspect-square">
                        <Image
                          src={entry.logo}
                          alt={`${entry.venue} logo`}
                          width={400}
                          height={400}
                          unoptimized
                          className="h-full w-full scale-[0.84] object-contain transition duration-500 group-hover:scale-[0.882]"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[4/3] overflow-hidden bg-[var(--paper-2)] sm:aspect-square">
                        <Image
                          src={entry.image ?? `/images/press/press-${(i % 3) + 1}.svg`}
                          alt={entry.title}
                          width={400}
                          height={400}
                          unoptimized
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-sans-ui mb-1 text-xs tracking-[0.15em] text-[var(--ash)] uppercase">
                        {entry.venue} · {entry.year}
                      </p>
                      <h2 className="text-xl transition group-hover:text-[var(--accent)]">{entry.title}</h2>
                      <p className="mt-1 text-sm text-[var(--ink)]/60">{entry.description}</p>
                      {entry.url && (
                        <span className="font-sans-ui mt-2 inline-flex items-center gap-1.5 text-base text-[var(--ink)]/70 transition group-hover:text-[var(--ink)]">
                          Read the feature
                          <ArrowIcon className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                        </span>
                      )}
                    </div>
                  </Wrapper>
                );
              })}
            </Reveal>
          }
        />
      </div>

      <Footer />
    </>
  );
}
