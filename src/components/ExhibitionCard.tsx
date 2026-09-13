"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import type { PressEntry } from "@/data/press";

function CloseIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function ChevronLeftIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// An exhibition card that opens into a large "theater mode" gallery on
// click, the same grow-from-the-card GSAP pattern as FilmThumb's video
// lightbox — the lightbox tweens from the card's own on-screen rect up
// to a big centered target, rather than just fading in, and reverses
// the same tween back into the card on close.
//
// Cards with nothing to show (a placeholder entry with no `image`)
// aren't clickable at all — no gallery to open.
export function ExhibitionCard({
  entry,
  thumbnailSrc,
}: {
  entry: PressEntry;
  thumbnailSrc: string;
}) {
  const images = entry.images && entry.images.length > 0 ? entry.images : entry.image ? [entry.image] : [];
  const hasGallery = images.length > 0;

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const originRect = useRef<{ top: number; left: number; width: number; height: number } | null>(null);

  function next() {
    setIndex((i) => (i + 1) % images.length);
  }
  function prev() {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }

  function handleOpen() {
    if (!hasGallery) return;
    const el = cardRef.current;
    if (el) {
      const r = el.getBoundingClientRect();
      originRect.current = { top: r.top, left: r.left, width: r.width, height: r.height };
    }
    setIndex(0);
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
    gsap
      .timeline({ defaults: { duration: 0.6, ease: "power3.inOut" }, onComplete: () => setOpen(false) })
      .to(overlay, { top: from.top, left: from.left, width: from.width, height: from.height, borderRadius: 0 }, 0)
      .to(backdrop, { opacity: 0, duration: 0.4 }, 0.1);
  }

  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const overlay = overlayRef.current;
    const backdrop = backdropRef.current;
    const from = originRect.current;
    if (overlay && backdrop && from) {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const targetWidth = Math.min(vw * 0.92, 1100);
      const targetHeight = vh * 0.85;
      const targetTop = (vh - targetHeight) / 2;
      const targetLeft = (vw - targetWidth) / 2;

      gsap.set(overlay, { top: from.top, left: from.left, width: from.width, height: from.height, borderRadius: 0 });
      gsap.set(backdrop, { opacity: 0 });
      gsap
        .timeline({ defaults: { duration: 0.85, ease: "power4.out" } })
        .to(backdrop, { opacity: 1, duration: 0.4, ease: "power2.out" }, 0)
        .to(overlay, { top: targetTop, left: targetLeft, width: targetWidth, height: targetHeight, borderRadius: 8 }, 0);
    }

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- next/prev use functional setIndex updates, always operating on the latest index/images regardless of when this effect's closure was created
  }, [open]);

  // A drag/swipe gesture past a small threshold advances — simple
  // pointer delta on release, no continuous tracking needed since
  // (unlike the homepage marquee) nothing here auto-animates mid-drag.
  const dragStartX = useRef(0);
  const dragging = useRef(false);
  function onPointerDown(e: React.PointerEvent) {
    dragging.current = true;
    dragStartX.current = e.clientX;
  }
  function onPointerUp(e: React.PointerEvent) {
    if (!dragging.current) return;
    dragging.current = false;
    const dx = e.clientX - dragStartX.current;
    if (dx > 60) prev();
    else if (dx < -60) next();
  }

  return (
    <>
      <div
        ref={cardRef}
        role={hasGallery ? "button" : undefined}
        tabIndex={hasGallery ? 0 : undefined}
        onClick={handleOpen}
        onKeyDown={(e) => hasGallery && (e.key === "Enter" || e.key === " ") && (e.preventDefault(), handleOpen())}
        className={`group ${hasGallery ? "cursor-pointer" : ""}`}
      >
        <div className="relative mb-5 aspect-[4/5] overflow-hidden bg-[var(--paper-2)]">
          <Image
            src={thumbnailSrc}
            alt={entry.title}
            fill
            unoptimized
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          {images.length > 1 && (
            <span className="font-sans-ui absolute right-3 bottom-3 rounded-full bg-black/50 px-2.5 py-1 text-xs text-white backdrop-blur">
              {images.length} photos
            </span>
          )}
        </div>
        <p className="font-sans-ui mb-1 text-xs tracking-[0.15em] text-[var(--ash)] uppercase">
          {entry.venue} · {entry.year} · {entry.status}
        </p>
        <h2 className="text-xl">{entry.title}</h2>
        <p className="mt-1 text-sm text-[var(--ink)]/60">{entry.description}</p>
      </div>

      {open && (
        <>
          <div ref={backdropRef} onClick={handleClose} className="fixed inset-0 z-[100] bg-black/95" />
          <div ref={overlayRef} className="fixed z-[101] overflow-hidden bg-[var(--ink)]">
            <div
              className="relative h-full w-full touch-pan-y select-none"
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
            >
              <Image
                key={images[index]}
                src={images[index]}
                alt={`${entry.title} — photo ${index + 1} of ${images.length}`}
                fill
                unoptimized
                className="object-contain"
              />
            </div>

            <button
              onClick={handleClose}
              aria-label="Close"
              className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
            >
              <CloseIcon />
            </button>

            {images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  aria-label="Previous photo"
                  className="absolute top-1/2 left-3 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
                >
                  <ChevronLeftIcon />
                </button>
                <button
                  onClick={next}
                  aria-label="Next photo"
                  className="absolute top-1/2 right-3 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
                >
                  <ChevronRightIcon />
                </button>
                <span className="font-sans-ui absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur">
                  {index + 1} / {images.length}
                </span>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
