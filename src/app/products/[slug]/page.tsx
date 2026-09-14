import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ProductCarousel } from "@/components/ProductCarousel";
import { StickyEnquire } from "@/components/StickyEnquire";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { Magnetic } from "@/components/motion/Magnetic";
import { getAllProducts, getProductBySlug } from "@/data/products";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.romanized,
    description: product.about.join(" "),
    openGraph: {
      title: `${product.displayName} — ${product.series}`,
      description: product.about[0],
      images: [{ url: product.images[0] }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const specs = [
    { label: "Product Code", value: product.details.productCode },
    { label: "Material", value: product.details.material },
    {
      label: "Dimension",
      value: `Height: ${product.details.dimensions.height}   Width: ${product.details.dimensions.width}   Depth: ${product.details.dimensions.depth}`,
    },
    { label: "Weight", value: product.details.weight },
    { label: "Lead Time", value: product.details.leadTime },
  ];

  return (
    <>
      <Nav />

      <section className="mx-auto max-w-[1800px] px-6 sm:px-10 lg:px-16 py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal as="div" variant="image" className="lg:sticky lg:top-24 lg:self-start">
            <ProductCarousel images={product.images} alt={product.romanized} />
          </Reveal>

          <div>
            <Reveal>
              <p className="font-sans-ui mb-3 flex items-center gap-2 text-xs tracking-[0.2em] text-[var(--ash)] uppercase">
                {!product.placeholder && product.series !== "—"
                  ? `${product.series} Series · ${product.category}`
                  : product.category}
              </p>
            </Reveal>
            <RevealText
              as="h1"
              className={`text-4xl leading-tight sm:text-5xl ${product.romanized !== product.displayName ? "mb-2" : "mb-10"}`}
            >
              {product.displayName}
            </RevealText>
            {product.romanized !== product.displayName && (
              <Reveal delay={0.05}>
                <p className="font-sans-ui mb-10 text-lg text-[var(--ink)]/50">
                  ({product.romanized})
                </p>
              </Reveal>
            )}

            <Reveal delay={0.1} className="mb-12">
              <p className="font-sans-ui mb-4 text-xs tracking-[0.2em] text-[var(--ash)] uppercase">
                About Product
              </p>
              {product.about.map((paragraph, i) => (
                <p
                  key={i}
                  className="mb-4 leading-relaxed text-[var(--ink)]/80 last:mb-0"
                >
                  {paragraph}
                </p>
              ))}
              {product.closing.length > 0 && (
                <div className="mt-4 space-y-3">
                  {product.closing.map((line, i) => (
                    <p key={i} className="italic leading-relaxed text-[var(--ink)]/70">
                      {line}
                    </p>
                  ))}
                </div>
              )}
            </Reveal>

            <Reveal delay={0.15} className="mb-12">
              <p className="font-sans-ui mb-4 text-xs tracking-[0.2em] text-[var(--ash)] uppercase">
                Product Details
              </p>
              <dl className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
                {specs.map((spec) => (
                  <div key={spec.label} className="py-4">
                    <dt className="font-sans-ui mb-1 text-sm font-medium text-[var(--ink)]">
                      {spec.label}
                    </dt>
                    <dd className="text-sm text-[var(--ink)]/70">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.2} className="inline-block">
              <Magnetic>
                <Link
                  id="product-enquire-cta"
                  href={`/acquire?product=${product.slug}`}
                  className="font-sans-ui inline-flex items-center justify-center gap-2 rounded-full bg-[var(--ink)] px-7 py-3.5 text-sm font-medium text-white transition hover:bg-[var(--accent)] hover:text-[var(--ink)]"
                >
                  Converse
                </Link>
              </Magnetic>
            </Reveal>
          </div>
        </div>
      </section>

      <Footer />

      <StickyEnquire slug={product.slug} label={product.romanized} />
    </>
  );
}
