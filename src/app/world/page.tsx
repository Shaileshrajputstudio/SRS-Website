import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Coil } from "@/components/Coil";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { Magnetic } from "@/components/motion/Magnetic";
import { WorldGalleryMarquee } from "@/components/WorldGalleryMarquee";
import {
  PurposeIcon,
  VisionIcon,
  MissionIcon,
  QuietRebellionIcon,
  InnocentCuriosityIcon,
  ElementalWisdomIcon,
  LayeredSimplicityIcon,
} from "@/components/WorldIcons";

export const metadata: Metadata = {
  title: "The Studio",
  description:
    "The studio story, the founder story, the philosophy and the values of Shailesh Rajput Studio.",
};

const studioGallery = [
  { image: "/images/world-gallery/design-week.png", text: "" },
  { image: "/images/world-gallery/exhibition-floor.png", text: "" },
  { image: "/images/world-gallery/the-team.png", text: "" },
  { image: "/images/world-gallery/in-the-making.png", text: "" },
  { image: "/images/world-gallery/tribe.png", text: "" },
];

const belief = [
  {
    name: "Purpose",
    icon: PurposeIcon,
    statement: "To create moments of pause, reflection, and inner connection.",
    supporting:
      "Each object placed into the world carries a story. Childlike curiosity, observing deeply, feeling deeply, translating emotion into form, SRS creates slowly and intuitively, allowing story, material, process, and emotion to shape each piece.",
  },
  {
    name: "Vision",
    icon: VisionIcon,
    statement: "To be an evolving practice of life and design.",
    supporting:
      "Bringing together creators, artisans, materials, stories, and philosophies that inspire people to live with presence. Reimagining humanity's relationship with creation.",
  },
  {
    name: "Mission",
    icon: MissionIcon,
    statement: "To create soulful Indian objects and experiences through intuition.",
    supporting:
      "Shaping materials with patience and hand, through the creator's inspired originality and material innovation.",
  },
];

const values = [
  {
    name: "Quiet Rebellion",
    icon: QuietRebellionIcon,
    description:
      "We reject performative luxury and trend-driven creation in favour of emotional depth and enduring originality.",
  },
  {
    name: "Innocent Curiosity",
    icon: InnocentCuriosityIcon,
    description:
      "We approach life and making with openness, wonder, and a willingness to observe before assuming.",
  },
  {
    name: "Elemental Wisdom",
    icon: ElementalWisdomIcon,
    description:
      "We trust intuition and nature as forms of intelligence, listening deeply before shaping form.",
  },
  {
    name: "Layered Simplicity",
    icon: LayeredSimplicityIcon,
    description:
      "We seek depth through essence, creating work that is simple, yet reveals deeper truths in its layers.",
  },
];

export default function WorldPage() {
  return (
    <>
      <Nav />

      <section className="mx-auto max-w-3xl px-6 pt-20 pb-16 text-center sm:pt-28">
        <Reveal>
          <p className="font-sans-ui mb-4 flex items-center justify-center gap-2 text-xs tracking-[0.2em] text-[var(--ash)] uppercase">
            The Studio
          </p>
        </Reveal>
        <RevealText as="h1" className="text-4xl leading-tight sm:text-5xl">
          The reincarnation story, told in full.
        </RevealText>
      </section>

      <Reveal
        as="section"
        variant="image"
        className="mx-auto mb-8 max-w-[1800px] px-6 sm:px-10 lg:px-16"
      >
        <div className="relative h-[70vh] min-h-[420px] w-full overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src="/videos/srs-srs.mp4" type="video/mp4" />
          </video>
        </div>
      </Reveal>

      <section className="mx-auto max-w-2xl px-6 py-16">
        <Reveal>
          <p className="font-sans-ui mb-3 text-xs tracking-[0.2em] text-[var(--ash)] uppercase">
            The Studio Story
          </p>
        </Reveal>
        <RevealText as="p" className="mb-6 text-xl leading-relaxed sm:text-2xl">
          Shailesh Rajput Studio (SRS) is a design practice creating
          sculptural lighting, objects, and experiences inspired by the
          intelligence of nature and the deeper patterns that shape
          existence.
        </RevealText>
        <Reveal delay={0.05}>
          <p className="mb-6 text-[var(--ink)]/80 leading-relaxed">
            Rooted in observation, curiosity, and intuitive making, the
            studio sees creation as a way of understanding the world. The
            same forces that shape rivers, roots, erosion, growth, and
            transformation become a source of inspiration for form,
            material, and meaning.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mb-6 text-[var(--ink)]/80 leading-relaxed">
            At SRS, objects are not viewed as static possessions, but as
            living presences within everyday life, carrying atmosphere,
            memory, story, and emotion into the spaces they inhabit. Each
            creation is approached as an exploration, allowing material and
            discovery to guide its evolution.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="text-[var(--ink)]/80 leading-relaxed">
            Rather than following trends or pursuing novelty, the studio
            seeks to distill the essence of an idea into its purest
            expression. SRS believes design can reconnect people to
            presence, shaping not only how a space looks, but how it is
            experienced over time.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1800px] px-6 pb-16 sm:px-10 lg:px-16">
        <WorldGalleryMarquee items={studioGallery} />
      </section>

      <section className="border-t border-[var(--line)] bg-[var(--ink)] text-white">
        <div className="mx-auto max-w-[1800px] px-6 sm:px-10 lg:px-16 py-20 sm:py-28">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-[180px_1fr] sm:gap-16">
            <Reveal>
              <p className="font-sans-ui text-xs tracking-[0.2em] text-white/50 uppercase">
                The Founder Story
              </p>
            </Reveal>
            <div>
              <Reveal>
                <p className="mb-6 text-lg leading-relaxed sm:text-xl">
                  As observers, seekers, and makers, Shailesh and Mansi
                  approach design as a process of discovery rather than
                  control. Questions arrive before answers. Intuition
                  arrives before logic.
                </p>
              </Reveal>
              <Reveal delay={0.05}>
                <p className="mb-6 text-lg leading-relaxed text-white/80 sm:text-xl">
                  Through sketching, experimentation, reflection, and
                  making, their observations gradually take shape as
                  objects that invite others into the same sense of wonder,
                  curiosity, and presence.
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mb-6 text-lg leading-relaxed text-white/80 sm:text-xl">
                  Their practice is rooted in looking closely, at nature,
                  materials, forms, light, shadow, and the quiet details of
                  everyday life. Rather than beginning with a fixed answer,
                  they allow each idea to unfold through the process of
                  making, letting curiosity and intuition guide what comes
                  next.
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="mb-6 text-lg leading-relaxed text-white/80 sm:text-xl">
                  For Shailesh and Mansi, design is not simply about
                  creating products. It is a way of observing, questioning,
                  and understanding the world. A way of translating moments
                  of curiosity into something tangible, something that can
                  be experienced, lived with, and discovered over time.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mb-14 text-lg leading-relaxed text-white/80 sm:text-xl">
                  This way of seeing became the foundation of Shailesh
                  Rajput Studio, a practice where observation becomes
                  form, intuition meets craft, and design becomes a way of
                  understanding and participating in life.
                </p>
              </Reveal>

              <Reveal variant="image" className="max-w-md overflow-hidden">
                <Image
                  src="/images/founder-portrait.png"
                  alt="Shailesh and Mansi — Founders, Shailesh Rajput Studio"
                  width={1195}
                  height={1254}
                  unoptimized
                  className="w-full object-cover"
                />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-5xl overflow-hidden px-6 py-20 sm:py-32">
        <Coil className="pointer-events-none absolute -top-20 -right-20 h-[420px] w-[420px] text-[var(--ink)]/[0.04] sm:h-[560px] sm:w-[560px]" />
        <p className="font-sans-ui relative mb-16 text-xs tracking-[0.2em] text-[var(--ash)] uppercase sm:mb-24">
          Our Belief System
        </p>
        <Reveal as="div" staggerChildren className="relative flex flex-col gap-16 sm:gap-24">
          {belief.map((b) => (
            <div
              key={b.name}
              className="grid grid-cols-1 gap-6 sm:grid-cols-[minmax(0,220px)_1fr] sm:gap-16"
            >
              <div className="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-5">
                <b.icon className="h-9 w-9 text-[var(--accent)] sm:h-11 sm:w-11" />
                <h2 className="text-sm tracking-[0.15em] text-[var(--ash)] uppercase">
                  {b.name}
                </h2>
              </div>
              <div>
                <p className="mb-5 text-[24px] leading-snug">{b.statement}</p>
                <p className="max-w-xl text-sm leading-relaxed text-[var(--ink)]/70 sm:text-base">
                  {b.supporting}
                </p>
              </div>
            </div>
          ))}
        </Reveal>
      </section>

      <div className="mx-auto max-w-5xl px-6">
        <div className="border-t border-[#D6CEB5]" />
      </div>

      <section className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
        <p className="font-sans-ui mb-14 text-xs tracking-[0.2em] text-[var(--ash)] uppercase">
          Core Values
        </p>
        <Reveal as="div" staggerChildren className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.name}>
              <v.icon className="mb-5 h-8 w-8 text-[var(--accent)]" />
              <h3 className="mb-2 text-xl">{v.name}</h3>
              <p className="text-[var(--ink)]/70 leading-relaxed">{v.description}</p>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="border-t border-[var(--line)] bg-[var(--ink)] px-6 py-20 text-center text-white">
        <Reveal>
          <p className="font-sans-ui mb-4 text-xs tracking-[0.2em] uppercase text-white/60">
            Sadhana · साधना
          </p>
        </Reveal>
        <RevealText as="h2" className="mx-auto mb-8 max-w-xl text-3xl leading-snug sm:text-4xl">
          Design approach, philosophy, principles and product pillars, the
          practice the studio has always run on.
        </RevealText>
        <Reveal delay={0.1} className="inline-block">
          <Magnetic>
            <Link
              href="/sadhana"
              className="font-sans-ui inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-[var(--ink)] transition hover:bg-[var(--accent)]"
            >
              Explore Sadhana
            </Link>
          </Magnetic>
        </Reveal>
      </section>

      <Footer />
    </>
  );
}
