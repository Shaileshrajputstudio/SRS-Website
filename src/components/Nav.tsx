"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { studio } from "@/lib/studio";
import { Magnetic } from "@/components/motion/Magnetic";

const links = [
  { href: "/products", label: "Shop by Series" },
  { href: "/collections", label: "Shop by Stories" },
  { href: "/world", label: "The Studio" },
  { href: "/sadhana", label: "Sadhana" },
  { href: "/films", label: "Films" },
  { href: "/press", label: "Exhibitions & Press" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";
  const mobileMenuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isHome) return;
    // The hero is a full h-screen video, so switch to the solid style right
    // as it scrolls out of view — not on the first few pixels of scroll,
    // which would show a solid cream bar sitting on top of the still-mostly
    // -visible dark video underneath it.
    function onScroll() {
      setScrolled(window.scrollY > window.innerHeight - 120);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    const el = mobileMenuRef.current;
    if (!open || !el) return;
    // A quick stagger-in each time the mobile menu opens — skipped
    // entirely under reduced motion, where the menu just appears.
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const items = el.children;
      gsap.fromTo(
        items,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.05, delay: 0.1 },
      );
    }
    // Full-page takeover — lock the page behind it from scrolling while open.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // On the homepage the nav starts transparent, overlaid on the full-bleed
  // video hero — but it still needs to stay docked while scrolling, same as
  // every other page. `fixed` (not `sticky`) keeps it pinned without adding
  // real document height that would push the hero down. Once scrolled past
  // the hero it switches to the same solid paper background every other
  // page uses, since white-on-transparent would be illegible over content.
  const transparentHome = isHome && !scrolled;
  // While the full-page mobile menu is open, the header row above it should
  // read as one continuous dark takeover rather than keeping whatever
  // paper/transparent state the page scroll position happened to be in.
  const darkChrome = transparentHome || open;

  return (
    <header
      className={`font-sans-ui top-0 z-50 transition-colors duration-300 ${
        isHome ? "fixed inset-x-0" : "sticky"
      } ${open ? "bg-[var(--ink)]" : transparentHome ? "" : "bg-[var(--paper)]/95 backdrop-blur"}`}
    >
      <div className="mx-auto flex max-w-[1800px] items-center justify-between px-6 sm:px-10 lg:px-16 py-5">
        <Link href="/" className="block" onClick={() => setOpen(false)}>
          <Image
            src="/brand/srs-logo.png"
            alt={studio.name}
            width={1488}
            height={366}
            priority
            unoptimized
            className={`h-[37px] w-auto transition sm:h-[42px] ${darkChrome ? "brightness-0 invert" : ""}`}
          />
        </Link>

        <nav className="hidden items-center gap-8 text-sm md:flex">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative inline-block py-1 ${
                  transparentHome
                    ? active
                      ? "text-white"
                      : "text-white/80 hover:text-white"
                    : active
                      ? "text-[var(--ink)]"
                      : "text-[var(--ink)]/60 hover:text-[var(--ink)]"
                }`}
              >
                {link.label}
                {/* A thin underline that grows in from the center on hover
                    — and stays fully drawn for whichever page is current,
                    so the active tab reads as clearly selected rather
                    than just a shade darker. Pure CSS (transform, not
                    width), so it's cheap and never triggers layout. */}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 -bottom-0.5 h-px origin-center transition-transform duration-300 ease-out group-hover:scale-x-100 ${
                    active ? "scale-x-100" : "scale-x-0"
                  } ${transparentHome ? "bg-white" : "bg-[var(--ink)]"}`}
                />
              </Link>
            );
          })}
          <Magnetic strength={0.4}>
            <Link
              href="/acquire"
              className={
                transparentHome
                  ? "rounded-full bg-white px-5 py-2.5 text-[var(--ink)] transition hover:bg-[var(--accent)]"
                  : "rounded-full bg-[var(--ink)] px-5 py-2.5 text-white transition hover:bg-[var(--accent)] hover:text-[var(--ink)]"
              }
            >
              Converse
            </Link>
          </Magnetic>
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="relative z-10 -mr-2.5 flex h-11 w-11 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span
            className={`h-px w-6 transition-transform duration-300 ${
              darkChrome ? "bg-white" : "bg-[var(--ink)]"
            } ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
          />
          <span
            className={`h-px w-6 transition-transform duration-300 ${
              darkChrome ? "bg-white" : "bg-[var(--ink)]"
            } ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      <nav
        ref={mobileMenuRef}
        aria-hidden={!open}
        className={`fixed inset-x-0 top-[77px] bottom-0 z-40 flex flex-col justify-center gap-2 bg-[var(--ink)] px-6 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0"
        }`}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {links.map((link) => {
          const active = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`py-2.5 text-3xl ${active ? "text-white" : "text-white/60"}`}
            >
              {link.label}
              {active && <span className="ml-2 text-[var(--accent)]">·</span>}
            </Link>
          );
        })}
        <Link
          href="/acquire"
          onClick={() => setOpen(false)}
          className="mt-8 rounded-full bg-white px-5 py-3.5 text-center text-lg text-[var(--ink)]"
        >
          Converse
        </Link>
      </nav>
    </header>
  );
}
