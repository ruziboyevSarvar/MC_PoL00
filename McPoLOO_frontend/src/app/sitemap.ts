import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/services/api";
import { getSiteUrl } from "@/utils/url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = getSiteUrl();
  const [categories, products] = await Promise.all([getCategories(), getProducts(new URLSearchParams("size=40"))]);
  return [
    { url: `${site}/catalog`, changeFrequency: "daily", priority: 1 },
    ...categories.map((category) => ({ url: `${site}/catalog/${category.slug}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...products.content.map((product) => ({ url: `${site}/products/${product.slug}`, changeFrequency: "weekly" as const, priority: 0.8 }))
  ];
}
