"use client";

import { Fragment, useRef } from "react";
import type { ReactNode } from "react";
import gsap from "gsap";
import { scrollVelocity, useIsomorphicLayoutEffect } from "@/lib/motion";

type MarqueeProps<T> = {
  items: T[];
  renderItem: (item: T, indexInTrack: number) => ReactNode;
  keyFor: (item: T, indexInTrack: number) => string;
  /** Baseline drift speed in px/second. */
  speed?: number;
  /** Classes for the flex track itself (gap, alignment) — not the outer
   * clipping wrapper. */
  trackClassName?: string;
};

// A continuously drifting strip (product/photo marquees) driven by GSAP's
// ticker rather than a CSS @keyframes loop, so its speed can react to how
// fast the visitor is scrolling the page — a small "alive" nudge, not a
// literal 1:1 link, giving the whole thing a bit of scroll-speed-based
// motion without being distracting. Renders the item list twice back-to-
// back and wraps the position at the halfway point, so the loop is
// seamless. Pauses on hover, and can also be dragged (mouse or touch) to
// scrub through it directly — dragging always pauses the drift, and on
// release it only auto-resumes if the pointer wasn't a mouse still
// hovering (mouse: stays paused, matching the existing hover-pause;
// touch: resumes immediately, since touch has no hover state to wait
// on). Under `prefers-reduced-motion` it renders the same doubled track
// but never starts moving on its own — dragging still works either way.
export function Marquee<T>({
  items,
  renderItem,
  keyFor,
  speed = 34,
  trackClassName = "gap-8",
}: MarqueeProps<T>) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const track = [...items, ...items];

  useIsomorphicLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const trackEl = trackRef.current;
    if (!wrapper || !trackEl) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let x = 0;
    let paused = false;
    let halfWidth = trackEl.scrollWidth / 2;

    const wrapX = (val: number) => {
      if (halfWidth === 0) return val;
      let v = val % halfWidth;
      if (v > 0) v -= halfWidth;
      return v;
    };

    const measure = () => {
      halfWidth = trackEl.scrollWidth / 2;
    };
    const ro = new ResizeObserver(measure);
    ro.observe(trackEl);

    const onEnter = () => (paused = true);
    const onLeave = () => (paused = false);
    wrapper.addEventListener("mouseenter", onEnter);
    wrapper.addEventListener("mouseleave", onLeave);

    // Drag-to-scrub: a plain click still navigates (FeaturedCarousel's
    // items are links) — only a drag that actually moves past a small
    // threshold suppresses the click that would otherwise fire on
    // pointerup, via a capture-phase listener below.
    let dragging = false;
    let dragMoved = false;
    let dragPointerId: number | null = null;
    let dragStartClientX = 0;
    let dragStartX = 0;

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      dragging = true;
      dragMoved = false;
      paused = true;
      dragPointerId = e.pointerId;
      dragStartClientX = e.clientX;
      dragStartX = x;
      try {
        wrapper.setPointerCapture(e.pointerId);
      } catch {
        // No active pointer session for this id (seen with synthetic/
        // programmatic pointer events) — dragging still works via the
        // window-level move/up listeners below, capture just isn't
        // guaranteed once the pointer leaves the wrapper's bounds.
      }
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== dragPointerId) return;
      const dx = e.clientX - dragStartClientX;
      if (Math.abs(dx) > 4) dragMoved = true;
      x = wrapX(dragStartX + dx);
      gsap.set(trackEl, { x });
    };
    const onPointerUp = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== dragPointerId) return;
      dragging = false;
      dragPointerId = null;
      try {
        wrapper.releasePointerCapture(e.pointerId);
      } catch {
        // already released (e.g. pointercancel) — nothing to do
      }
      if (e.pointerType !== "mouse") paused = false;
    };
    const onClickCapture = (e: MouseEvent) => {
      if (dragMoved) {
        e.preventDefault();
        e.stopPropagation();
        dragMoved = false;
      }
    };

    wrapper.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    wrapper.addEventListener("click", onClickCapture, true);

    const tick = (_time: number, deltaMs: number) => {
      if (paused || dragging || reduceMotion || halfWidth === 0) return;
      const dt = deltaMs / 1000;
      // A gentle boost from how fast the page is being scrolled right now
      // — capped, so a flick of the wheel doesn't send the strip flying.
      const velocityBoost = Math.min(Math.abs(scrollVelocity.current) * 4, 140);
      x -= (speed + velocityBoost) * dt;
      if (x <= -halfWidth) x += halfWidth;
      gsap.set(trackEl, { x });
    };

    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      ro.disconnect();
      wrapper.removeEventListener("mouseenter", onEnter);
      wrapper.removeEventListener("mouseleave", onLeave);
      wrapper.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      wrapper.removeEventListener("click", onClickCapture, true);
    };
  }, [speed]);

  return (
    <div
      ref={wrapperRef}
      className="marquee-wrapper relative touch-pan-y cursor-grab overflow-hidden [-webkit-user-select:none] select-none active:cursor-grabbing"
    >
      <div ref={trackRef} className={`flex w-max ${trackClassName}`}>
        {track.map((item, i) => (
          <Fragment key={keyFor(item, i)}>{renderItem(item, i)}</Fragment>
        ))}
      </div>
    </div>
  );
}
