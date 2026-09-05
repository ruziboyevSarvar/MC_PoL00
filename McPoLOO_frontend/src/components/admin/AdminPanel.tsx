"use client";

import { Edit3, EyeOff, ImagePlus, LogOut, Plus, Save, Search, Trash2 } from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { API_URL, adminFetch, normalizeImageUrl } from "@/services/api";
import { Category, PageResponse, Product, ProductAttribute, ProductStatus } from "@/types/catalog";
import { formatPrice } from "@/utils/format";

type ProductForm = {
  id?: string;
  name: string;
  slug: string;
  brand: string;
  model: string;
  price: string;
  oldPrice: string;
  description: string;
  mainImageUrl: string;
  status: ProductStatus;
  featured: boolean;
  newArrival: boolean;
  categoryId: string;
  attributesText: string;
  galleryText: string;
};

const emptyForm: ProductForm = {
  name: "",
  slug: "",
  brand: "Mc PoLOO",
  model: "",
  price: "",
  oldPrice: "",
  description: "",
  mainImageUrl: "",
  status: "ACTIVE",
  featured: false,
  newArrival: false,
  categoryId: "",
  attributesText: "Material: \nRang: \nKafolat: ",
  galleryText: ""
};

export function AdminPanel() {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("mcpoloo_admin_token");
  });
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [notice, setNotice] = useState("");

  const logout = useCallback(() => {
    localStorage.removeItem("mcpoloo_admin_token");
    setToken(null);
  }, []);

  const load = useCallback(async () => {
    try {
      const [productPage, categoryList] = await Promise.all([
        adminFetch<PageResponse<Product>>(`/admin/products?size=60${query ? `&q=${encodeURIComponent(query)}` : ""}`),
        adminFetch<Category[]>("/admin/categories")
      ]);
      setProducts(productPage.content);
      setCategories(categoryList);
      if (!form.categoryId && categoryList[0]) setForm((current) => ({ ...current, categoryId: categoryList[0].id }));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ma'lumot yuklanmadi";
      setNotice(message);
      if (message.includes("Sessiya")) logout();
    }
  }, [form.categoryId, logout, query]);

  useEffect(() => {
    if (token) void load();
  }, [token, load]);

  async function login(event: FormEvent) {
    event.preventDefault();
    setNotice("");
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      if (!response.ok) throw new Error("Login yoki parol noto'g'ri");
      const data = await response.json();
      localStorage.setItem("mcpoloo_admin_token", data.token);
      setToken(data.token);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Kirishda xatolik");
    }
  }

  async function saveProduct(event: FormEvent) {
    event.preventDefault();
    try {
      const attributes: ProductAttribute[] = form.attributesText.split("\n").map((line, index) => {
        const [name, ...rest] = line.split(":");
        return { name: name?.trim(), value: rest.join(":").trim(), sortOrder: index + 1 };
      }).filter((item) => item.name && item.value) as ProductAttribute[];

      const payload = {
        name: form.name,
        slug: form.slug || undefined,
        brand: form.brand,
        model: form.model,
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        description: form.description,
        mainImageUrl: form.mainImageUrl,
        status: form.status,
        featured: form.featured,
        newArrival: form.newArrival,
        categoryId: form.categoryId,
        attributes,
        galleryImages: form.galleryText.split("\n").map((url, index) => ({ url: url.trim(), alt: form.name, sortOrder: index + 1 })).filter((item) => item.url)
      };

      await adminFetch(form.id ? `/admin/products/${form.id}` : "/admin/products", {
        method: form.id ? "PUT" : "POST",
        body: JSON.stringify(payload)
      });
      setNotice(form.id ? "Mahsulot yangilandi" : "Mahsulot qo'shildi");
      setForm({ ...emptyForm, categoryId: categories[0]?.id ?? "" });
      await load();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Mahsulot saqlanmadi");
    }
  }

  async function saveCategory(event: FormEvent) {
    event.preventDefault();
    try {
      await adminFetch(categoryId ? `/admin/categories/${categoryId}` : "/admin/categories", {
        method: categoryId ? "PUT" : "POST",
        body: JSON.stringify({ name: categoryName, slug: categorySlug, description: "", imageUrl: "", active: true, sortOrder: categories.length + 1 })
      });
      setNotice(categoryId ? "Kategoriya yangilandi" : "Kategoriya qo'shildi");
      setCategoryId("");
      setCategoryName("");
      setCategorySlug("");
      await load();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Kategoriya saqlanmadi");
    }
  }

  async function removeProduct(id: string) {
    try {
      await adminFetch(`/admin/products/${id}`, { method: "DELETE" });
      setNotice("Mahsulot o'chirildi");
      await load();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Mahsulot o'chirilmadi");
    }
  }

  async function removeCategory(id: string) {
    try {
      await adminFetch(`/admin/categories/${id}`, { method: "DELETE" });
      setNotice("Kategoriya o'chirildi");
      await load();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Kategoriya o'chirilmadi");
    }
  }

  async function setStatus(product: Product, status: ProductStatus) {
    try {
      await adminFetch(`/admin/products/${product.id}`, {
        method: "PUT",
        body: JSON.stringify({ ...product, categoryId: product.category.id, status, attributes: product.attributes, galleryImages: product.galleryImages })
      });
      setNotice(status === "ACTIVE" ? "Mahsulot ko'rsatildi" : "Mahsulot yashirildi");
      await load();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Status yangilanmadi");
    }
  }

  async function uploadImage(file: File) {
    try {
      const savedToken = localStorage.getItem("mcpoloo_admin_token");
      const body = new FormData();
      body.append("file", file);
      const response = await fetch(`${API_URL}/admin/uploads/images`, {
        method: "POST",
        headers: savedToken ? { Authorization: `Bearer ${savedToken}` } : {},
        body
      });
      if (response.status === 401 || response.status === 403) {
        logout();
        throw new Error("Sessiya tugagan. Qayta login qiling.");
      }
      if (!response.ok) throw new Error("Rasm yuklanmadi");
      const data = await response.json();
      setForm((current) => ({ ...current, mainImageUrl: normalizeImageUrl(data.url) }));
      setNotice("Rasm yuklandi");
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Rasm yuklanmadi");
    }
  }

  function edit(product: Product) {
    setForm({
      id: product.id,
      name: product.name,
      slug: product.slug,
      brand: product.brand,
      model: product.model,
      price: String(product.price),
      oldPrice: product.oldPrice ? String(product.oldPrice) : "",
      description: product.description ?? "",
      mainImageUrl: product.mainImageUrl,
      status: product.status,
      featured: product.featured,
      newArrival: product.newArrival,
      categoryId: product.category.id,
      attributesText: product.attributes.map((attribute) => `${attribute.name}: ${attribute.value}`).join("\n"),
      galleryText: product.galleryImages.map((image) => image.url).join("\n")
    });
  }

  const totalValue = useMemo(() => products.reduce((sum, item) => sum + item.price, 0), [products]);

  if (!token) {
    return (
      <main className="grid min-h-screen place-items-center bg-porcelain p-6">
        <form onSubmit={login} className="w-full max-w-md rounded-lg border border-line bg-white p-6 shadow-soft">
          <h1 className="text-2xl font-extrabold">Mc PoLOO admin</h1>
          <p className="mt-2 text-sm text-muted">Mahsulot, kategoriya, rasm, narx va statuslarni boshqarish.</p>
          <input value={username} onChange={(event) => setUsername(event.target.value)} className="mt-6 h-11 w-full rounded-lg border border-line px-3 outline-none focus:border-brass" placeholder="Login" />
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" className="mt-3 h-11 w-full rounded-lg border border-line px-3 outline-none focus:border-brass" placeholder="Parol" />
          {notice && <p className="mt-3 text-sm font-semibold text-red-600">{notice}</p>}
          <button className="mt-5 h-11 w-full rounded-full bg-ink text-sm font-bold text-white">Kirish</button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-porcelain">
      <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brass">Admin panel</p>
            <h1 className="text-2xl font-extrabold">Mc PoLOO boshqaruvi</h1>
          </div>
          <button onClick={logout} className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white" aria-label="Chiqish"><LogOut className="h-5 w-5" /></button>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1440px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[390px_1fr] lg:px-8">
        {notice && <div className="rounded-lg border border-line bg-white p-4 text-sm font-bold text-ink lg:col-span-2">{notice}</div>}

        <section className="rounded-lg border border-line bg-white p-5">
          <h2 className="flex items-center gap-2 text-lg font-extrabold"><Plus className="h-5 w-5" /> Mahsulot formasi</h2>
          <form onSubmit={saveProduct} className="mt-5 grid gap-3">
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nomi" className="h-11 rounded-lg border border-line px-3 outline-none focus:border-brass" />
            <div className="grid grid-cols-2 gap-3">
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="Slug" className="h-11 rounded-lg border border-line px-3 outline-none focus:border-brass" />
              <input required value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} placeholder="Model" className="h-11 rounded-lg border border-line px-3 outline-none focus:border-brass" />
            </div>
            <input required value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="Brend" className="h-11 rounded-lg border border-line px-3 outline-none focus:border-brass" />
            <div className="grid grid-cols-2 gap-3">
              <input required type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Narx" className="h-11 rounded-lg border border-line px-3 outline-none focus:border-brass" />
              <input type="number" value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} placeholder="Eski narx" className="h-11 rounded-lg border border-line px-3 outline-none focus:border-brass" />
            </div>
            <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="h-11 rounded-lg border border-line px-3 outline-none focus:border-brass">
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ProductStatus })} className="h-11 rounded-lg border border-line px-3 outline-none focus:border-brass">
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
            </select>
            <input required value={form.mainImageUrl} onChange={(e) => setForm({ ...form, mainImageUrl: e.target.value })} placeholder="Asosiy rasm URL" className="h-11 rounded-lg border border-line px-3 outline-none focus:border-brass" />
            <textarea value={form.galleryText} onChange={(e) => setForm({ ...form, galleryText: e.target.value })} placeholder="Gallery URL, har qatorda bitta" className="min-h-20 rounded-lg border border-line p-3 outline-none focus:border-brass" />
            <textarea value={form.attributesText} onChange={(e) => setForm({ ...form, attributesText: e.target.value })} className="min-h-28 rounded-lg border border-line p-3 outline-none focus:border-brass" />
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Tavsif" className="min-h-24 rounded-lg border border-line p-3 outline-none focus:border-brass" />
            <label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Top mahsulot</label>
            <label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={form.newArrival} onChange={(e) => setForm({ ...form, newArrival: e.target.checked })} /> Yangi</label>
            <button className="flex h-11 items-center justify-center gap-2 rounded-full bg-ink text-sm font-bold text-white"><Save className="h-4 w-4" /> Saqlash</button>
          </form>
        </section>

        <section className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat label="Mahsulotlar" value={products.length} />
            <Stat label="Kategoriyalar" value={categories.length} />
            <Stat label="Katalog qiymati" value={formatPrice(totalValue)} />
          </div>
          <div className="rounded-lg border border-line bg-white p-5">
            <form onSubmit={saveCategory} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
              <input required value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="Kategoriya nomi" className="h-11 rounded-lg border border-line px-3 outline-none focus:border-brass" />
              <input value={categorySlug} onChange={(e) => setCategorySlug(e.target.value)} placeholder="Slug" className="h-11 rounded-lg border border-line px-3 outline-none focus:border-brass" />
              <button className="h-11 rounded-full bg-ink px-5 text-sm font-bold text-white">{categoryId ? "Saqlash" : "Qo'shish"}</button>
            </form>
            <div className="mt-4 grid gap-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between gap-3 rounded-lg border border-line p-3">
                  <div>
                    <p className="text-sm font-bold">{category.name}</p>
                    <p className="text-xs text-muted">/{category.slug}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setCategoryId(category.id); setCategoryName(category.name); setCategorySlug(category.slug); }} className="grid h-9 w-9 place-items-center rounded-full border border-line" aria-label="Kategoriya tahrirlash"><Edit3 className="h-4 w-4" /></button>
                    <button onClick={() => removeCategory(category.id)} className="grid h-9 w-9 place-items-center rounded-full border border-line text-red-600" aria-label="Kategoriya o'chirish"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-line bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-lg font-extrabold">Mahsulotlar ro&apos;yxati</h2>
              <div className="flex h-11 items-center gap-2 rounded-full border border-line px-4">
                <Search className="h-4 w-4 text-muted" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} onBlur={load} placeholder="Qidirish" className="bg-transparent text-sm outline-none" />
              </div>
            </div>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-muted">
                  <tr><th className="py-3">Mahsulot</th><th>Model</th><th>Narx</th><th>Status</th><th>Amal</th></tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-t border-line">
                      <td className="py-3 font-bold">{product.name}<span className="block text-xs font-medium text-muted">{product.category.name}</span></td>
                      <td>{product.model}</td>
                      <td>{formatPrice(product.price)}</td>
                      <td><span className="rounded-full bg-porcelain px-3 py-1 text-xs font-bold">{product.status}</span></td>
                      <td>
                        <div className="flex gap-2">
                          <button onClick={() => edit(product)} className="grid h-9 w-9 place-items-center rounded-full border border-line" aria-label="Tahrirlash"><Edit3 className="h-4 w-4" /></button>
                          <button onClick={() => setStatus(product, product.status === "ACTIVE" ? "INACTIVE" : "ACTIVE")} className="grid h-9 w-9 place-items-center rounded-full border border-line" aria-label="Yashirish yoki ko'rsatish"><EyeOff className="h-4 w-4" /></button>
                          <button onClick={() => removeProduct(product.id)} className="grid h-9 w-9 place-items-center rounded-full border border-line text-red-600" aria-label="O'chirish"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="rounded-lg border border-line bg-white p-5">
            <h2 className="flex items-center gap-2 text-lg font-extrabold"><ImagePlus className="h-5 w-5" /> Rasm yuklash</h2>
            <p className="mt-2 text-sm text-muted">JPG, PNG, WebP yoki AVIF yuklang. URL qaytgach mahsulot formasiga qo&apos;yiladi.</p>
            <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => event.target.files?.[0] && uploadImage(event.target.files[0])} className="mt-4 block w-full text-sm" />
          </div>
        </section>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-line bg-white p-5">
      <p className="text-sm font-bold text-muted">{label}</p>
      <p className="mt-2 text-2xl font-extrabold">{value}</p>
    </div>
  );
}
