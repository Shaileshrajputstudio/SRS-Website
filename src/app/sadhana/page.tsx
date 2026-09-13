import Image from "next/image";
import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import {
  EvolutionIcon,
  TactilityIcon,
  SimplicityIcon,
  InstinctIcon,
  HumanPaceIcon,
  TouchedIcon,
  QuietAliveIcon,
  StoryWithinIcon,
} from "@/components/SadhanaIcons";

export const metadata: Metadata = {
  title: "Sadhana",
  description:
    "Sadhana, the practice. The design approach, philosophy, principles and product pillars Shailesh Rajput Studio runs on.",
};

const principles = [
  { name: "Evolution", icon: EvolutionIcon, description: "Designs evolve naturally through process, intuition, and time." },
  { name: "Tactility", icon: TactilityIcon, description: "Texture, materiality, and sensory experience are central to every object." },
  { name: "Simplicity", icon: SimplicityIcon, description: "Clarity without emptiness. Simplicity that feels intentional." },
  { name: "Innovation through Instinct", icon: InstinctIcon, description: "Original creation guided by intuition." },
  { name: "Human Pace", icon: HumanPaceIcon, description: "Design that respects slowness, presence, process, and the natural rhythms of life." },
];

const pillars = [
  { name: "Made to be touched", icon: TouchedIcon, description: "Every surface invites touch, its texture and weight considered as carefully as its form." },
  { name: "Quiet, yet alive", icon: QuietAliveIcon, description: "A subtle presence carrying depth, beneath the surface." },
  { name: "A story within", icon: StoryWithinIcon, description: "Every object carries a narrative." },
];

export default function SadhanaPage() {
  return (
    <>
      <Nav />

      <section className="mx-auto max-w-4xl px-6 pt-20 pb-8 text-center sm:pt-28">
        <Reveal>
          <p className="font-sans-ui mb-4 text-xs tracking-[0.2em] text-[var(--ash)] uppercase">
            Sadhana
          </p>
        </Reveal>
        <RevealText as="h1" className="text-3xl leading-tight sm:text-4xl">
          The practice the studio has always run on.
        </RevealText>
      </section>

      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 py-16 sm:grid-cols-2 sm:gap-16">
        <Reveal variant="image" className="relative aspect-[4/5] overflow-hidden">
          <Image
            src="/images/products/kalay-ceiling/1.jpg"
            alt="A Shailesh Rajput Studio pendant light installed above a home kitchen counter"
            fill
            unoptimized
            className="object-cover"
          />
        </Reveal>
        <div>
          <Reveal>
            <p className="font-sans-ui mb-3 text-xs tracking-[0.2em] text-[var(--ash)] uppercase">
              Design Approach
            </p>
          </Reveal>
          <RevealText as="p" className="mb-6 text-2xl leading-relaxed sm:text-3xl">
            Good design quietly becomes part of life.
          </RevealText>
          <Reveal delay={0.05}>
            <p className="text-[var(--ink)]/70 leading-relaxed">
              This is the emotional and strategic role design plays in the
              brand, why design matters to the studio, and what role it
              plays in people&apos;s lives. It brings joy and satisfaction
              into everyday living and making.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-[var(--footer-bg)] px-6 py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 sm:grid-cols-2 sm:gap-16">
          <div className="order-2 sm:order-1">
            <Reveal>
              <p className="font-sans-ui mb-3 text-xs tracking-[0.2em] text-[var(--ash)] uppercase">
                Design Philosophy — Saar
              </p>
            </Reveal>
            <RevealText as="p" className="mb-6 text-2xl leading-relaxed sm:text-3xl">
              The purest expression of an idea, feeling, or experience
              distilled to what truly matters.
            </RevealText>
            <Reveal delay={0.05}>
              <p className="text-[var(--ink)]/70 leading-relaxed">
                Like Kabir, whose words held immense depth with remarkable
                brevity, SRS seeks to distill emotion into forms that feel
                effortless yet profound. Depth through simplicity. Meaning
                through restraint.
              </p>
            </Reveal>
          </div>
          <Reveal
            variant="image"
            className="relative order-1 aspect-[4/5] overflow-hidden sm:order-2"
          >
            <Image
              src="/images/collections/kabir-ke-dohe-cover.jpg"
              alt="A sadhu carrying the studio's Jhola lamp along the ghats at night, evoking Kabir's verses"
              fill
              unoptimized
              className="object-cover"
            />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <Reveal as="div" staggerChildren className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {["/images/stills/aranya-still-1.jpg", "/images/stills/aranya-still-2.jpg", "/images/stills/aranya-still-3.jpg"].map(
            (src) => (
              <div key={src} className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={src}
                  alt="A close study of hand-worked texture and material from the studio's own pieces"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            ),
          )}
        </Reveal>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-20">
        <Reveal>
          <p className="font-sans-ui mb-14 text-xs tracking-[0.2em] text-[var(--ash)] uppercase">
            Design Principles
          </p>
        </Reveal>
        <Reveal as="div" staggerChildren className="grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((p) => (
            <div key={p.name}>
              <p.icon className="mb-4 h-9 w-9 text-[var(--accent)]" />
              <h3 className="mb-2 text-lg">{p.name}</h3>
              <p className="text-sm text-[var(--ink)]/70 leading-relaxed">{p.description}</p>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="border-t border-[var(--line)] bg-[var(--ink)] px-6 py-20 text-white">
        <Reveal>
          <p className="font-sans-ui mb-10 text-center text-xs tracking-[0.2em] uppercase text-white/50">
            Product Pillars
          </p>
        </Reveal>
        <Reveal as="div" staggerChildren className="mx-auto grid max-w-4xl grid-cols-1 gap-x-10 gap-y-10 text-center sm:grid-cols-3">
          {pillars.map((p) => (
            <div key={p.name} className="flex flex-col items-center">
              <p.icon className="mb-4 h-7 w-7 text-[var(--accent)]" />
              <h3 className="mb-2 text-xl">{p.name}</h3>
              <p className="text-sm leading-relaxed text-white/60">{p.description}</p>
            </div>
          ))}
        </Reveal>
      </section>

      <Footer />
    </>
  );
}
