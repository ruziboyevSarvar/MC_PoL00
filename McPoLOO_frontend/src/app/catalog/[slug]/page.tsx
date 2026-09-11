import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CatalogClient } from "@/components/catalog/CatalogClient";
import { getCategories, getProducts } from "@/services/api";
import { getSiteUrl } from "@/utils/url";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((item) => item.slug === slug);
  return {
    title: category ? category.name : "Kategoriya",
    description: category?.description,
    alternates: {
      canonical: `${getSiteUrl()}/catalog/${slug}`
    }
  };
}

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { slug } = await params;
  const resolvedSearch = await searchParams;
  const categories = await getCategories();
  if (!categories.some((item) => item.slug === slug)) notFound();
  const query = new URLSearchParams({ category: slug });
  Object.entries(resolvedSearch).forEach(([key, value]) => {
    if (typeof value === "string" && key !== "category") query.set(key, value);
  });
  const page = await getProducts(query);
  return (
    <>
      <Header />
      <main className="min-h-screen bg-porcelain/60"><CatalogClient categories={categories} page={page} currentCategory={slug} /></main>
      <Footer />
    </>
  );
}
