import { categories as mockCategories, mockPage, products as mockProducts } from "@/services/mock-data";
import { Category, PageResponse, Product } from "@/types/catalog";

function normalizeBaseUrl(value: string | undefined, fallback: string) {
  return (value?.trim() || fallback).replace(/\/+$/, "");
}

export const API_URL = normalizeBaseUrl(process.env.NEXT_PUBLIC_API_URL, "http://localhost:8080/api");
const ASSET_URL = normalizeBaseUrl(process.env.NEXT_PUBLIC_ASSET_URL, API_URL.replace(/\/api\/?$/, ""));
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false" || process.env.NODE_ENV === "development";

async function read<T>(path: string, demoFallback: T, productionFallback: T, init?: RequestInit): Promise<T> {
  if (DEMO_MODE) {
    return normalizeApiData(demoFallback) as T;
  }

  try {
    const response = await fetch(`${API_URL}${path}`, { ...init, cache: "no-store" });
    if (!response.ok) throw new Error("API error");
    return normalizeApiData(await response.json()) as T;
  } catch {
    return normalizeApiData(productionFallback) as T;
  }
}

export function getCategories() {
  return read<Category[]>("/categories", mockCategories, []);
}

export function getProducts(params: URLSearchParams) {
  return read<PageResponse<Product>>(`/products?${params.toString()}`, mockPage(params), mockPage(params));
}

export function getProductBySlug(slug: string) {
  return read<Product | null>(`/products/slug/${slug}`, mockProducts.find((item) => item.slug === slug) ?? null, null);
}

export function getRelated(slug: string) {
  const product = mockProducts.find((item) => item.slug === slug);
  return read<Product[]>(`/products/slug/${slug}/related`, product ? mockProducts.filter((item) => item.category.slug === product.category.slug && item.slug !== slug) : [], []);
}

export async function adminFetch<T>(path: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("mcpoloo_admin_token") : null;
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("mcpoloo_admin_token");
    throw new Error("Sessiya tugagan. Qayta login qiling.");
  }
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message ?? "So'rov bajarilmadi");
  }
  if (response.status === 204) return null as T;
  return normalizeApiData(await response.json()) as T;
}

export function normalizeImageUrl(url?: string | null) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/uploads/")) return `${ASSET_URL}${url}`;
  return url;
}

function normalizeProduct(product: Product): Product {
  return {
    ...product,
    mainImageUrl: normalizeImageUrl(product.mainImageUrl),
    galleryImages: product.galleryImages?.map((image) => ({ ...image, url: normalizeImageUrl(image.url) })) ?? [],
    category: product.category ? { ...product.category, imageUrl: normalizeImageUrl(product.category.imageUrl) } : product.category
  };
}

function normalizeApiData(data: unknown): unknown {
  if (Array.isArray(data)) {
    return data.map((item) => {
      const candidate = item as Partial<Product>;
      if ("model" in candidate && "price" in candidate) return normalizeProduct(item as Product);
      const category = item as Category;
      return { ...category, imageUrl: normalizeImageUrl(category.imageUrl) };
    });
  }
  if (data && typeof data === "object" && "content" in data) {
    const page = data as PageResponse<Product>;
    return { ...page, content: page.content.map(normalizeProduct) };
  }
  if (data && typeof data === "object" && "model" in data && "price" in data) {
    return normalizeProduct(data as Product);
  }
  return data;
}
