"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useStudioInfo } from "@/components/StudioInfoContext";
import { PhoneIcon, WhatsAppIcon, EmailIcon, InstagramIcon } from "@/components/ConnectIcons";

function ChatIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// A small persistent floating action button (every page, via the root
// layout) that expands into the studio's direct contact channels —
// separate from the footer's social "Follow" links, which are for
// following the brand rather than reaching it directly. Kept to the
// site's own ink/paper palette and "Converse" language rather than the
// generic bright-icon chat-widget look.
export function FloatingContact() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const studioInfo = useStudioInfo();

  // The admin panel is an internal tool for the studio itself — a "reach
  // the studio" widget doesn't belong there.
  if (pathname?.startsWith("/admin")) return null;

  const options = [
    { label: "Call", href: `tel:${studioInfo.phone}`, icon: PhoneIcon, external: false },
    {
      label: "WhatsApp",
      href: `https://wa.me/${studioInfo.whatsapp}`,
      icon: WhatsAppIcon,
      external: true,
    },
    {
      label: "Instagram DM",
      href: studioInfo.instagramDm,
      icon: InstagramIcon,
      external: true,
    },
    { label: "Email", href: `mailto:${studioInfo.email}`, icon: EmailIcon, external: false },
  ];

  return (
    // bottom-24 (not bottom-6) so this clears StickyEnquire's ~76px-tall
    // bottom bar on product pages instead of overlapping it — plus the
    // device's own safe-area inset, so it never crowds an iPhone's home
    // indicator (that inset is 0 on devices without one, so this is a
    // no-op there).
    <div
      className="font-sans-ui fixed right-6 z-40 flex flex-col items-end gap-3"
      style={{ bottom: "calc(6rem + env(safe-area-inset-bottom))" }}
    >
      {open && (
        <div className="animate-fade-up flex flex-col items-end gap-2">
          {options.map(({ label, href, icon: Icon, external }) => (
            <a
              key={label}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-full bg-[var(--accent)] py-2.5 pr-4 pl-3 text-sm text-[var(--ink)] shadow-lg transition hover:bg-[var(--ink)] hover:text-white"
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </a>
          ))}
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close contact options" : "Contact the studio"}
        aria-expanded={open}
        className="relative flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[var(--accent)] text-[var(--ink)] shadow-lg transition hover:bg-[var(--ink)] hover:text-white"
      >
        {!open && (
          <span className="animate-pulse-ring absolute inset-0 -z-10 rounded-full bg-[var(--accent)]/60" />
        )}
        {open ? <CloseIcon /> : <ChatIcon />}
      </button>
    </div>
  );
}
