import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { studio } from "@/lib/studio";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Shailesh Rajput Studio collects, uses, and protects your information.",
};

const sections = [
  {
    heading: "Information We Collect",
    body: [
      "When you reach out through our Converse form, we collect the details you choose to share, typically your name, email address or phone number, city or country, the collection or product you're interested in, and any message you send.",
      "We do not ask for payment details, government identifiers, or other sensitive personal information anywhere on this site.",
    ],
  },
  {
    heading: "How We Use It",
    body: [
      "Your details are used solely to respond to your enquiry by email, and to continue the conversation about a product, collection, or collaboration.",
      "We do not sell, rent, or share your information with third parties for marketing purposes.",
    ],
  },
  {
    heading: "How Enquiries Are Sent",
    body: [
      "The Converse form on this site does not store your message on a server. When you tap \"Send Message,\" your browser opens your own email app directly with the message pre-filled, and the enquiry is sent from your own device through your own email account.",
      "Messages sent this way are subject to your email provider's own privacy practices once they leave your device.",
    ],
  },
  {
    heading: "Cookies & Local Storage",
    body: [
      "This site does not use tracking cookies or third-party analytics. We use your browser's session storage for one purpose only, to remember that you've already seen the entry animation on the home page, so it doesn't replay on every visit within the same browsing session. This is cleared automatically when you close your browser.",
    ],
  },
  {
    heading: "Embedded Content",
    body: [
      "Our Contact page embeds a Google Map to show the studio's location. Google may set its own cookies or collect usage data when that map loads, governed by Google's privacy policy.",
    ],
  },
  {
    heading: "Your Rights",
    body: [
      `You may ask us at any time what information we hold about you, or request that we delete it, by writing to ${studio.email}. We will respond within a reasonable time.`,
    ],
  },
  {
    heading: "Changes to This Policy",
    body: [
      "If our practices change, we'll update this page. The date below reflects the last revision.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Nav />

      <section className="mx-auto max-w-3xl px-6 pt-20 pb-16 text-center sm:pt-28">
        <p className="font-sans-ui mb-4 flex items-center justify-center gap-2 text-xs tracking-[0.2em] text-[var(--ash)] uppercase">
          Privacy Policy
        </p>
        <h1 className="mb-3 text-4xl leading-tight sm:text-5xl">
          How we handle your information.
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
            Questions about this policy can be sent to{" "}
            <a href={`mailto:${studio.email}`} className="text-[var(--ink)] underline underline-offset-2 hover:text-[var(--accent)]">
              {studio.email}
            </a>
            .
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
