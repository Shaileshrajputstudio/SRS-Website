"use client";

import { useState } from "react";
import { useStudioInfo } from "@/components/StudioInfoContext";

export type AcquirePieceOption = {
  slug: string;
  label: string;
};

const intents = [
  "Personal collection",
  "Interior / architecture project",
  "Gallery or curatorial enquiry",
  "Press or collaboration",
];

export function AcquireForm({
  pieces,
  initialCollection,
  initialMessage,
}: {
  pieces: AcquirePieceOption[];
  initialCollection?: string;
  initialMessage?: string;
}) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [piece, setPiece] = useState(initialCollection ?? "");
  const [intent, setIntent] = useState(intents[0]);
  const [geography, setGeography] = useState("");
  const [message, setMessage] = useState(initialMessage ?? "");
  const studioInfo = useStudioInfo();

  function buildMessage() {
    const pieceLabel =
      pieces.find((p) => p.slug === piece)?.label || piece || "Not specified";
    return [
      `Hi, I'd like to begin a conversation with the studio.`,
      ``,
      `Name: ${name || "—"}`,
      `Contact: ${contact || "—"}`,
      `Collection of interest: ${pieceLabel}`,
      `Intent: ${intent}`,
      `Location: ${geography || "—"}`,
      message ? `Message: ${message}` : null,
    ]
      .filter(Boolean)
      .join("\n");
  }

  function handleSubmit() {
    const subject = encodeURIComponent("Enquiry — Shailesh Rajput Studio");
    const body = encodeURIComponent(buildMessage());
    window.location.href = `mailto:${studioInfo.email}?subject=${subject}&body=${body}`;
  }

  return (
    <div className="font-sans-ui mx-auto max-w-xl">
      <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs tracking-[0.15em] text-[var(--ash)] uppercase">
            Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-[var(--line)] bg-[var(--footer-bg)] px-4 py-3 text-base text-[var(--ink)] outline-none sm:text-sm focus:border-[var(--ink)]"
          />
        </div>
        <div>
          <label className="mb-2 block text-xs tracking-[0.15em] text-[var(--ash)] uppercase">
            Email or Phone
          </label>
          <input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full rounded-lg border border-[var(--line)] bg-[var(--footer-bg)] px-4 py-3 text-base text-[var(--ink)] outline-none sm:text-sm focus:border-[var(--ink)]"
          />
        </div>
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-xs tracking-[0.15em] text-[var(--ash)] uppercase">
          Collection of Interest
        </label>
        <div className="relative">
          <select
            value={piece}
            onChange={(e) => setPiece(e.target.value)}
            className="w-full appearance-none rounded-lg border border-[var(--line)] bg-[var(--footer-bg)] px-4 py-3 pr-11 text-base text-[var(--ink)] outline-none sm:text-sm focus:border-[var(--ink)]"
          >
            <option value="">Not sure yet</option>
            {pieces.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.label}
              </option>
            ))}
          </select>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-[var(--ink)]/50"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-xs tracking-[0.15em] text-[var(--ash)] uppercase">
          Intent
        </label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {intents.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setIntent(option)}
              className={`rounded-lg border px-4 py-3 text-left text-sm transition ${
                intent === option
                  ? "border-[var(--ink)] bg-[var(--ink)] text-white"
                  : "border-[var(--line)] bg-[var(--footer-bg)] text-[var(--ink)] hover:border-[var(--ink)]"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-xs tracking-[0.15em] text-[var(--ash)] uppercase">
          Location (City / Country)
        </label>
        <input
          value={geography}
          onChange={(e) => setGeography(e.target.value)}
          className="w-full rounded-lg border border-[var(--line)] bg-[var(--footer-bg)] px-4 py-3 text-base text-[var(--ink)] outline-none sm:text-sm focus:border-[var(--ink)]"
        />
      </div>

      <div className="mb-8">
        <label className="mb-2 block text-xs tracking-[0.15em] text-[var(--ash)] uppercase">
          Message (Optional)
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-[var(--line)] bg-[var(--footer-bg)] px-4 py-3 text-base text-[var(--ink)] outline-none sm:text-sm focus:border-[var(--ink)]"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full rounded-full bg-[var(--ink)] px-6 py-3.5 text-sm font-medium text-white transition hover:bg-[var(--accent)] hover:text-[var(--ink)]"
      >
        Send Message
      </button>
      <p className="mt-3 text-center text-xs text-[var(--ink)]/50">
        Opens your email app with this pre-filled, nothing is sent
        automatically.
      </p>
    </div>
  );
}
