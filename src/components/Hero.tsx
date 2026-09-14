"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { SoundToggle } from "@/components/SoundToggle";
import { useIsomorphicLayoutEffect } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, SplitText);

// The homepage's opening shot: a cinematic load-in (the video breathes in
// from a slight zoom, the headline rises line by line) followed by a
// gentle parallax drift as the visitor scrolls past it. Same markup,
// copy and video as before — this only adds the motion around them.
export function Hero({
  videoUrl,
  eyebrow,
  headline,
}: {
  videoUrl: string;
  eyebrow: string;
  headline: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    const eyebrow = eyebrowRef.current;
    const heading = headingRef.current;
    if (!section || !video || !eyebrow || !heading) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const split = SplitText.create(heading, { type: "lines", mask: "lines" });

      gsap.set(video, { scale: 1.12, opacity: 0 });
      gsap.set(eyebrow, { opacity: 0, y: 14 });
      gsap.set(split.lines, { yPercent: 110 });

      const tl = gsap.timeline({ delay: 0.15 });
      tl.to(video, { opacity: 1, scale: 1.06, duration: 1.8, ease: "power2.out" })
        .to(eyebrow, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.5)
        .to(
          split.lines,
          { yPercent: 0, duration: 1, ease: "power3.out", stagger: 0.1 },
          0.65,
        );

      // A slow, subtle drift as the hero scrolls out of view — the video
      // is pre-scaled to 1.06 above so this has room to move without ever
      // exposing an edge.
      gsap.to(video, {
        yPercent: 8,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
      });

      return () => split.revert();
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-screen min-h-[560px] items-end overflow-hidden"
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        poster="/images/arrival-hero.svg"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />
      <SoundToggle src="/audio/arrival-theme.mp3" />
      <div className="pointer-events-none relative z-10 mx-auto w-full max-w-[1800px] px-6 sm:px-10 lg:px-16 pb-16 text-white">
        <p
          ref={eyebrowRef}
          className="font-sans-ui mb-4 flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-white/80"
        >
          {eyebrow}
        </p>
        <h1
          ref={headingRef}
          className="max-w-2xl text-4xl leading-tight sm:text-5xl md:text-6xl"
        >
          {headline}
        </h1>
      </div>
    </section>
  );
}
