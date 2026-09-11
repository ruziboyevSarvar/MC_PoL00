import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, Wrench } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { ImageWithFallback } from "@/components/product/ImageWithFallback";
import { getCategories, getProducts } from "@/services/api";
import { getSiteUrl } from "@/utils/url";

export const metadata: Metadata = {
  title: "Mc PoLOO",
  description: "Mc PoLOO premium santexnika mahsulotlari: unitaz, rakovina va smesitellar katalogi.",
  alternates: {
    canonical: getSiteUrl()
  }
};

export default async function Home() {
  const [categories, productPage] = await Promise.all([
    getCategories(),
    getProducts(new URLSearchParams("size=8"))
  ]);
  const heroProduct = productPage.content[0];

  return (
    <>
      <Header />
      <main className="bg-white">
        <section className="border-b border-line bg-porcelain/60">
          <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_480px] lg:px-8 lg:py-14">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-brass">Premium European Line</p>
              <h1 className="mt-4 text-4xl font-black leading-tight text-ink sm:text-5xl">Mc PoLOO santexnika katalogi</h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-muted">Unitaz, rakovina va smesitellarni kategoriya, narx, rang va model bo&apos;yicha tanlang. Ombor holati va narxlar admin panel orqali yangilanadi.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/catalog" className="inline-flex h-12 items-center gap-2 rounded-[8px] bg-ink px-6 text-sm font-extrabold text-white">
                  Katalogni ko&apos;rish
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="#contact" className="inline-flex h-12 items-center rounded-[8px] border border-line bg-white px-6 text-sm font-extrabold text-ink">Bog&apos;lanish</Link>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <Feature icon={<ShieldCheck className="h-5 w-5" />} label="Rasmiy kafolat" />
                <Feature icon={<Truck className="h-5 w-5" />} label="Yetkazib berish" />
                <Feature icon={<Wrench className="h-5 w-5" />} label="O'rnatish maslahatlari" />
              </div>
            </div>
            <div className="relative min-h-[340px] overflow-hidden rounded-[8px] border border-line bg-white">
              {heroProduct ? (
                <ImageWithFallback src={heroProduct.mainImageUrl} alt={heroProduct.name} fill sizes="(max-width: 1024px) 100vw, 480px" className="object-contain p-8" />
              ) : (
                <div className="grid h-full min-h-[340px] place-items-center text-sm font-bold text-muted">Mc PoLOO katalogi</div>
              )}
            </div>
          </div>
        </section>

        <section id="categories" className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-brass">Kategoriyalar</p>
              <h2 className="mt-2 text-2xl font-black text-ink">Mahsulot yo&apos;nalishlari</h2>
            </div>
            <Link href="/catalog" className="text-sm font-extrabold text-ink">Barchasi</Link>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link key={category.id} href={`/catalog/${category.slug}`} className="rounded-[8px] border border-line bg-white p-5 transition hover:border-brass">
                <span className="text-lg font-black text-ink">{category.name}</span>
                {category.description && <span className="mt-2 block text-sm leading-6 text-muted">{category.description}</span>}
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 pb-14 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-brass">Yangi mahsulotlar</p>
              <h2 className="mt-2 text-2xl font-black text-ink">Katalogdan tanlanganlar</h2>
            </div>
            <Link href="/catalog?sort=new" className="text-sm font-extrabold text-ink">Katalogga o&apos;tish</Link>
          </div>
          <ProductGrid products={productPage.content} />
        </section>
      </main>
      <Footer />
    </>
  );
}

function Feature({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-[8px] border border-line bg-white p-3 text-sm font-extrabold text-ink">
      <span className="grid h-9 w-9 place-items-center rounded-[8px] bg-porcelain text-brass">{icon}</span>
      {label}
    </div>
  );
}
