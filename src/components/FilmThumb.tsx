"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import type { Film } from "@/data/collections";

function PlayIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
      <path d="M10 8.5v7l6-3.5-6-3.5Z" fill="currentColor" />
    </svg>
  );
}

function CloseIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

// A film thumbnail that opens into a large, centered "theater mode" instead
// of playing inline at its small grid size (unusable for anything but a
// glance). The lightbox video is a separate element from the thumbnail —
// on open we snapshot the thumbnail's own on-screen rect and GSAP-tween the
// lightbox from that exact position/size up to a big centered target, so it
// visually grows out of the thumbnail rather than just fading in; closing
// reverses the same tween back into the thumbnail before unmounting.
export function FilmThumb({
  film,
  poster,
  className = "",
}: {
  film: Film & { videoSrc: string };
  poster: string;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const originRect = useRef<{ top: number; left: number; width: number; height: number } | null>(null);
  const [open, setOpen] = useState(false);

  function handleOpen() {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    originRect.current = { top: r.top, left: r.left, width: r.width, height: r.height };
    setOpen(true);
  }

  function handleClose() {
    const overlay = overlayRef.current;
    const backdrop = backdropRef.current;
    const from = originRect.current;
    if (!overlay || !backdrop || !from) {
      setOpen(false);
      return;
    }
    videoRef.current?.pause();
    gsap.timeline({ defaults: { duration: 0.7, ease: "power3.inOut" }, onComplete: () => setOpen(false) })
      .to(overlay, { top: from.top, left: from.left, width: from.width, height: from.height, borderRadius: 16 }, 0)
      .to(backdrop, { opacity: 0, duration: 0.45 }, 0.1);
  }

  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const overlay = overlayRef.current;
    const backdrop = backdropRef.current;
    const from = originRect.current;
    if (overlay && backdrop && from) {
      // The target box: as large as the viewport comfortably allows while
      // keeping the film's own 9:16 aspect — capped by height first (these
      // are tall portrait clips) so it never runs off top/bottom.
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const targetHeight = Math.min(vh * 0.88, vw * 0.92 * (16 / 9));
      const targetWidth = targetHeight * (9 / 16);
      const targetTop = (vh - targetHeight) / 2;
      const targetLeft = (vw - targetWidth) / 2;

      gsap.set(overlay, { top: from.top, left: from.left, width: from.width, height: from.height, borderRadius: 16 });
      gsap.set(backdrop, { opacity: 0 });
      gsap.timeline({ defaults: { duration: 0.95, ease: "power4.out" } })
        .to(backdrop, { opacity: 1, duration: 0.5, ease: "power2.out" }, 0)
        .to(overlay, { top: targetTop, left: targetLeft, width: targetWidth, height: targetHeight, borderRadius: 12 }, 0);

      videoRef.current?.play().catch(() => {});
    }

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      {/* No mx-auto here — this is rendered inside a `flex flex-wrap
          justify-center gap-4` group on the collection chapter pages,
          and margin:auto on every flex item shares out ALL the row's
          leftover space across those auto margins, which blew the gap
          between cards out far past `gap-4`. The grid usage on
          /films (grid-cols-N) centers each thumb within its own cell
          via `justify-items-center` on the grid instead. */}
      <div
        ref={cardRef}
        role="button"
        tabIndex={0}
        onClick={handleOpen}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleOpen()}
        className={`group relative w-full max-w-[180px] cursor-pointer overflow-hidden rounded-2xl bg-[var(--ink)] ${className}`}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/70 to-transparent px-3 pt-3 pb-8 text-white">
          <p className="text-sm">{film.title}</p>
          <p className="font-sans-ui text-xs text-white/70">{film.type}</p>
        </div>
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center text-white/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <PlayIcon className="h-10 w-10" />
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element -- a plain poster thumbnail; next/image's fill mode fights the aspect-ratio class here */}
        <img
          src={poster}
          alt={film.title}
          className="aspect-[9/16] w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      {open && (
        <>
          <div
            ref={backdropRef}
            onClick={handleClose}
            className="fixed inset-0 z-[100] bg-black/90"
          />
          <div ref={overlayRef} className="fixed z-[101] overflow-hidden bg-[var(--ink)]">
            <video
              ref={videoRef}
              controls
              autoPlay
              playsInline
              poster={poster}
              className="h-full w-full object-cover"
            >
              <source src={film.videoSrc} type="video/mp4" />
            </video>
            <button
              onClick={handleClose}
              aria-label="Close"
              className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
            >
              <CloseIcon />
            </button>
          </div>
        </>
      )}
    </>
  );
}
