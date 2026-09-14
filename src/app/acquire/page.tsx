import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { AcquireForm } from "@/components/AcquireForm";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { getElements, getStoryCollections } from "@/data/collections";
import { getProductBySlug } from "@/data/products";

export const metadata: Metadata = {
  title: "Converse",
  description: "Begin a conversation with Shailesh Rajput Studio.",
};

export default async function AcquirePage({
  searchParams,
}: {
  searchParams: Promise<{ collection?: string; product?: string }>;
}) {
  const { collection, product: productSlug } = await searchParams;
  const [elements, storyCollections] = await Promise.all([getElements(), getStoryCollections()]);
  const collectionEntries = [...elements, ...storyCollections];
  const pieces = collectionEntries.map((c) => ({
    slug: c.slug,
    label: "element" in c ? `${c.title} — ${c.element}` : c.title,
  }));
  const product = productSlug ? await getProductBySlug(productSlug) : undefined;
  const initialMessage = product
    ? `I'm interested in ${product.romanized} (Product Code: ${product.details.productCode}).`
    : undefined;
  // A product enquiry doesn't carry its own ?collection= param, so derive one
  // from the product's series (e.g. "Parth:Sarathi") — an explicit ?collection=
  // still wins if both are somehow present.
  const derivedCollection = product
    ? collectionEntries.find((c) => c.title === product.series)?.slug
    : undefined;
  const initialCollection = collection ?? derivedCollection;

  return (
    <>
      <Nav />

      <section className="mx-auto max-w-2xl px-6 pt-20 pb-16 text-center sm:pt-28">
        <Reveal>
          <p className="font-sans-ui mb-4 flex items-center justify-center gap-2 text-xs tracking-[0.2em] text-[var(--ash)] uppercase">
            Converse
          </p>
        </Reveal>
        <RevealText as="h1" className="mb-6 text-4xl leading-tight sm:text-5xl">
          Every piece begins with a conversation.
        </RevealText>
        <Reveal delay={0.05}>
          <p className="text-[var(--ink)]/70 leading-relaxed">
            The quickest way to reach the studio. Tell us what you&apos;re
            drawn to, and we&apos;ll follow up directly, no prices, no
            pressure.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="font-sans-ui mt-5 text-sm text-[var(--ink)]/60">
            Planning a studio visit, or have a general question?{" "}
            <Link
              href="/contact"
              className="text-[var(--ink)] underline decoration-[var(--line)] underline-offset-4 hover:decoration-[var(--ink)]"
            >
              Contact
            </Link>{" "}
            has hours, address, and direct lines.
          </p>
        </Reveal>
      </section>

      <Reveal as="section" delay={0.1} className="px-6 pb-28">
        <AcquireForm
          pieces={pieces}
          initialCollection={initialCollection}
          initialMessage={initialMessage}
        />
      </Reveal>

      <Footer />
    </>
  );
}
