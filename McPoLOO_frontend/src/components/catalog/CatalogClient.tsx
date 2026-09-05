"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { Category, PageResponse, Product } from "@/types/catalog";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { ProductSkeleton } from "@/components/product/ProductSkeleton";

const colors = ["White", "Black", "Gold", "Chrome"];

export function CatalogClient({ categories, page, currentCategory }: { categories: Category[]; page: PageResponse<Product>; currentCategory?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useMemo(() => {
    const next = new URLSearchParams(searchParams.toString());
    if (currentCategory && !next.get("category")) next.set("category", currentCategory);
    return next;
  }, [currentCategory, searchParams]);
  const [drawer, setDrawer] = useState(false);
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [isPending, startTransition] = useTransition();

  const pushParams = useCallback((next: URLSearchParams) => {
    startTransition(() => router.push(`/catalog?${next.toString()}`));
  }, [router]);

  const setParam = useCallback((key: string, value: string, resetPage = true) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    if (resetPage) next.delete("page");
    pushParams(next);
  }, [params, pushParams]);

  function reset() {
    const next = new URLSearchParams();
    if (currentCategory) next.set("category", currentCategory);
    pushParams(next);
  }

  useEffect(() => {
    const handle = window.setTimeout(() => {
      const nextQuery = query.trim().length > 1 ? query.trim() : "";
      if ((searchParams.get("q") ?? "") !== nextQuery) {
        setParam("q", nextQuery);
      }
    }, 350);
    return () => window.clearTimeout(handle);
  }, [query, searchParams, setParam]);

  function changePage(nextPage: number) {
    setParam("page", String(nextPage), false);
  }

  const filters = (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-extrabold uppercase tracking-[0.16em]">Filter</h2>
        <button onClick={reset} className="text-sm font-bold text-muted hover:text-ink">Tozalash</button>
      </div>
      <label className="grid gap-2 text-sm font-semibold">
        Qidiruv
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="unitaz, M5032, dush..." className="h-11 rounded-lg border border-line px-3 font-normal outline-none focus:border-brass" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Kategoriya
        <select value={params.get("category") ?? ""} onChange={(event) => setParam("category", event.target.value)} className="h-11 rounded-lg border border-line px-3 font-normal outline-none focus:border-brass">
          <option value="">Barchasi</option>
          {categories.map((category) => <option key={category.id} value={category.slug}>{category.name}</option>)}
        </select>
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Brend
        <input defaultValue={params.get("brand") ?? ""} onBlur={(event) => setParam("brand", event.target.value)} placeholder="Mc PoLOO" className="h-11 rounded-lg border border-line px-3 font-normal outline-none focus:border-brass" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Rang
        <select value={params.get("color") ?? ""} onChange={(event) => setParam("color", event.target.value)} className="h-11 rounded-lg border border-line px-3 font-normal outline-none focus:border-brass">
          <option value="">Barchasi</option>
          {colors.map((color) => <option key={color} value={color}>{color}</option>)}
        </select>
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="grid gap-2 text-sm font-semibold">
          Min
          <input type="number" defaultValue={params.get("minPrice") ?? ""} onBlur={(event) => setParam("minPrice", event.target.value)} className="h-11 rounded-lg border border-line px-3 font-normal outline-none focus:border-brass" />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Max
          <input type="number" defaultValue={params.get("maxPrice") ?? ""} onBlur={(event) => setParam("maxPrice", event.target.value)} className="h-11 rounded-lg border border-line px-3 font-normal outline-none focus:border-brass" />
        </label>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-brass">Katalog</p>
          <h1 className="mt-2 text-3xl font-extrabold">Mahsulotlarni tanlang</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setDrawer(true)} className="flex h-11 items-center gap-2 rounded-full border border-line px-4 text-sm font-bold lg:hidden"><SlidersHorizontal className="h-4 w-4" /> Filter</button>
          <select value={params.get("sort") ?? "new"} onChange={(event) => setParam("sort", event.target.value)} className="h-11 rounded-full border border-line px-4 text-sm font-bold outline-none">
            <option value="new">Yangi mahsulotlar</option>
            <option value="price-asc">Narxi arzon</option>
            <option value="price-desc">Narxi qimmat</option>
          </select>
        </div>
      </div>
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="hidden rounded-lg border border-line bg-white p-5 lg:block">{filters}</aside>
        <section>
          <div className="mb-4 text-sm font-semibold text-muted">{page.totalElements} ta mahsulot</div>
          {isPending ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{Array.from({ length: 10 }).map((_, index) => <ProductSkeleton key={index} />)}</div> : <ProductGrid products={page.content} />}
          {page.totalPages > 1 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <button disabled={page.page <= 0} onClick={() => changePage(page.page - 1)} className="h-10 rounded-full border border-line bg-white px-4 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-40">Oldingi</button>
              {Array.from({ length: page.totalPages }).map((_, index) => (
                <button key={index} onClick={() => changePage(index)} className={`h-10 min-w-10 rounded-full border px-3 text-sm font-bold ${index === page.page ? "border-ink bg-ink text-white" : "border-line bg-white text-ink"}`}>{index + 1}</button>
              ))}
              <button disabled={page.page >= page.totalPages - 1} onClick={() => changePage(page.page + 1)} className="h-10 rounded-full border border-line bg-white px-4 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-40">Keyingi</button>
            </div>
          )}
        </section>
      </div>
      {drawer && (
        <div className="fixed inset-0 z-50 bg-ink/40 lg:hidden">
          <div className="absolute bottom-0 left-0 right-0 rounded-t-2xl bg-white p-5">
            <button onClick={() => setDrawer(false)} className="mb-5 ml-auto grid h-11 w-11 place-items-center rounded-full border border-line" aria-label="Filter yopish"><X className="h-5 w-5" /></button>
            {filters}
          </div>
        </div>
      )}
    </div>
  );
}
