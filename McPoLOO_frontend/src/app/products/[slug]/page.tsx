import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { getProductBySlug, getRelated } from "@/services/api";
import { formatPrice } from "@/utils/format";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Mahsulot topilmadi" };
  return {
    title: `${product.name} ${product.model}`,
    description: `${product.brand} ${product.model} narxi va texnik xususiyatlari.`,
    openGraph: { title: product.name, images: [product.mainImageUrl] }
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const related = await getRelated(slug);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: product.brand,
    model: product.model,
    image: [product.mainImageUrl],
    offers: { "@type": "Offer", price: product.price, priceCurrency: "UZS", availability: product.status === "ACTIVE" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" }
  };

  return (
    <>
      <Header />
      <main className="bg-white">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
          <nav className="mb-8 flex items-center gap-2 text-sm text-muted">
            <Link href="/">Bosh sahifa</Link><ChevronRight className="h-4 w-4" />
            <Link href="/catalog">Katalog</Link><ChevronRight className="h-4 w-4" />
            <Link href={`/catalog/${product.category.slug}`}>{product.category.name}</Link>
          </nav>
          <section className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <ProductGallery product={product} />
            <div className="lg:pl-8">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-brass">{product.brand}</p>
              <h1 className="mt-3 text-4xl font-extrabold leading-tight">{product.name}</h1>
              <p className="mt-3 text-sm font-semibold text-muted">Model: {product.model}</p>
              <div className="mt-6">
                {product.oldPrice && <p className="text-base font-semibold text-muted line-through">{formatPrice(product.oldPrice)}</p>}
                <p className="text-3xl font-extrabold">{formatPrice(product.price)}</p>
              </div>
              <div className="mt-5 inline-flex rounded-full border border-line px-4 py-2 text-sm font-bold">{product.status === "ACTIVE" ? "Mavjud" : product.status === "OUT_OF_STOCK" ? "Mavjud emas" : "Yashirilgan"}</div>
              {product.description && <p className="mt-8 max-w-2xl text-base leading-8 text-muted">{product.description}</p>}
              <div className="mt-8 rounded-lg border border-line">
                {product.attributes.map((attribute) => (
                  <div key={attribute.name} className="grid grid-cols-[0.8fr_1fr] gap-4 border-b border-line px-4 py-3 last:border-0">
                    <span className="text-sm font-bold">{attribute.name}</span>
                    <span className="text-sm text-muted">{attribute.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section className="mt-16">
            <h2 className="text-2xl font-extrabold">O&apos;xshash mahsulotlar</h2>
            <div className="mt-6"><ProductGrid products={related} /></div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
