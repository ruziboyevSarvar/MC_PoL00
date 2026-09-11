import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/services/api";
import { getSiteUrl } from "@/utils/url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = getSiteUrl();
  const categories = await getCategories();
  const products = await getAllProductsForSitemap();
  return [
    { url: site, changeFrequency: "daily", priority: 1 },
    { url: `${site}/catalog`, changeFrequency: "daily", priority: 1 },
    ...categories.map((category) => ({ url: `${site}/catalog/${category.slug}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...products.map((product) => ({ url: `${site}/products/${product.slug}`, changeFrequency: "weekly" as const, priority: 0.8 }))
  ];
}

async function getAllProductsForSitemap() {
  const firstPage = await getProducts(new URLSearchParams("size=40&page=0"));
  const products = [...firstPage.content];
  for (let page = 1; page < firstPage.totalPages; page++) {
    const nextPage = await getProducts(new URLSearchParams(`size=40&page=${page}`));
    products.push(...nextPage.content);
  }
  return products;
}
