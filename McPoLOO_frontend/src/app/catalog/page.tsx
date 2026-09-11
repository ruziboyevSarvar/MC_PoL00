import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CatalogClient } from "@/components/catalog/CatalogClient";
import { getCategories, getProducts } from "@/services/api";
import { getSiteUrl } from "@/utils/url";

export const metadata: Metadata = {
  title: "Katalog",
  description: "Mc PoLOO mahsulot katalogi: kategoriya, narx, rang va model bo'yicha qidiruv.",
  alternates: {
    canonical: `${getSiteUrl()}/catalog`
  }
};

export default async function CatalogPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const resolved = await searchParams;
  const params = new URLSearchParams();
  Object.entries(resolved).forEach(([key, value]) => {
    if (typeof value === "string") params.set(key, value);
  });
  const [categories, page] = await Promise.all([getCategories(), getProducts(params)]);
  return (
    <>
      <Header />
      <main className="min-h-screen bg-porcelain/60"><CatalogClient categories={categories} page={page} /></main>
      <Footer />
    </>
  );
}
