import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { studio } from "@/lib/studio";
import { getStudioContactInfo } from "@/data/studioInfo";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms that apply to browsing and using the Shailesh Rajput Studio website.",
};

// General website terms of use, not a commercial contract — the studio
// doesn't take orders or payment through this site, so terms of sale
// (deposits, lead times, cancellation, warranty) belong to a separate
// agreement made directly with the studio, not this page.
const sections = [
  {
    heading: "Using This Website",
    body: [
      "By browsing this website, you agree to these terms. If you do not agree, please do not use the site.",
    ],
  },
  {
    heading: "Intellectual Property",
    body: [
      `All photography, product designs, films, and writing on this site belong to ${studio.name}, unless credited otherwise. Nothing here may be copied, reproduced, or reused, in whole or in part, without our written permission.`,
    ],
  },
  {
    heading: "Enquiries Are Not a Purchase",
    body: [
      "Submitting a message through Converse or Contact does not create a binding order or agreement. Every product is made to order, and prices, timelines, and the terms of sale are agreed directly between you and the studio, outside this website.",
    ],
  },
  {
    heading: "Acceptable Use",
    body: [
      "You agree not to misuse this site, attempt to gain unauthorized access to it, or use any part of it in a way that could damage, disable, or impair its functioning.",
    ],
  },
  {
    heading: "No Warranty on Availability",
    body: [
      "This site is provided as is. We do not guarantee it will always be available, uninterrupted, or free of errors.",
    ],
  },
  {
    heading: "Limitation of Liability",
    body: [
      `To the extent permitted by law, ${studio.name} is not liable for any loss or damage arising from your use of this website.`,
    ],
  },
  {
    heading: "External Links",
    body: [
      "This site links to third-party platforms, Instagram, Facebook, Google Maps, and press coverage, that we don't control. Their own terms and privacy practices apply once you leave this site.",
    ],
  },
  {
    heading: "Governing Law",
    body: [
      "These terms are governed by the laws of India. Any disputes are subject to the exclusive jurisdiction of the courts in Mumbai.",
    ],
  },
  {
    heading: "Changes to These Terms",
    body: [
      "If these terms change, we'll update this page. The date below reflects the last revision.",
    ],
  },
];

export default async function TermsPage() {
  const studioInfo = await getStudioContactInfo();

  return (
    <>
      <Nav />

      <section className="mx-auto max-w-3xl px-6 pt-20 pb-16 text-center sm:pt-28">
        <p className="font-sans-ui mb-4 flex items-center justify-center gap-2 text-xs tracking-[0.2em] text-[var(--ash)] uppercase">
          Terms of Use
        </p>
        <h1 className="mb-3 text-4xl leading-tight sm:text-5xl">
          The terms behind this website.
        </h1>
        <p className="font-sans-ui text-sm text-[var(--ink)]/50">Last updated 12 September 2026</p>
      </section>

      <section className="mx-auto max-w-2xl px-6 pb-28">
        {sections.map((s) => (
          <div key={s.heading} className="mb-12 border-t border-[var(--line)] pt-8">
            <h2 className="font-sans-ui mb-4 text-xs tracking-[0.2em] text-[var(--ash)] uppercase">
              {s.heading}
            </h2>
            {s.body.map((p, i) => (
              <p key={i} className="mb-4 leading-relaxed text-[var(--ink)]/80 last:mb-0">
                {p}
              </p>
            ))}
          </div>
        ))}

        <div className="border-t border-[var(--line)] pt-8">
          <h2 className="font-sans-ui mb-4 text-xs tracking-[0.2em] text-[var(--ash)] uppercase">
            Contact
          </h2>
          <p className="leading-relaxed text-[var(--ink)]/80">
            Questions about these terms can be sent to{" "}
            <a href={`mailto:${studioInfo.email}`} className="text-[var(--ink)] underline underline-offset-2 hover:text-[var(--accent)]">
              {studioInfo.email}
            </a>
            .
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
