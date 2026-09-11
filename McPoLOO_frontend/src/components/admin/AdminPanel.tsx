"use client";

import {
  Bell,
  Box,
  CheckCircle2,
  ChevronDown,
  Database,
  Edit3,
  EyeOff,
  Filter,
  Folder,
  ImagePlus,
  LogOut,
  Package,
  Plus,
  RotateCcw,
  Save,
  Search,
  Tag,
  Trash2,
  UploadCloud
} from "lucide-react";
import { FormEvent, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { ImageWithFallback } from "@/components/product/ImageWithFallback";
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

const statusLabels: Record<ProductStatus, string> = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  OUT_OF_STOCK: "OMBORDA YO'Q"
};

export function AdminPanel() {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("mcpoloo_admin_token");
  });
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [productPage, setProductPage] = useState<PageResponse<Product> | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [query, setQuery] = useState("");
  const [adminPage, setAdminPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryImageUrl, setCategoryImageUrl] = useState("");
  const [categoryActive, setCategoryActive] = useState(true);
  const [categorySortOrder, setCategorySortOrder] = useState("");
  const [notice, setNotice] = useState("");

  const logout = useCallback(() => {
    localStorage.removeItem("mcpoloo_admin_token");
    setToken(null);
  }, []);

  const load = useCallback(async () => {
    try {
      const productParams = new URLSearchParams({
        page: String(adminPage),
        size: "20"
      });
      if (query) productParams.set("q", query);
      if (statusFilter) productParams.set("status", statusFilter);
      if (categoryFilter) productParams.set("category", categoryFilter);
      const [productPage, categoryList] = await Promise.all([
        adminFetch<PageResponse<Product>>(`/admin/products?${productParams.toString()}`),
        adminFetch<Category[]>("/admin/categories")
      ]);
      setProducts(productPage.content);
      setProductPage(productPage);
      setCategories(categoryList);
      setForm((current) => {
        if (current.categoryId || !categoryList[0]) return current;
        return { ...current, categoryId: categoryList[0].id };
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ma'lumot yuklanmadi";
      setNotice(message);
      if (message.includes("Sessiya")) logout();
    }
  }, [adminPage, categoryFilter, logout, query, statusFilter]);

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
    if (!form.mainImageUrl) {
      setNotice("Avval asosiy rasmni yuklang.");
      return;
    }
    try {
      const attributes: ProductAttribute[] = form.attributesText
        .split("\n")
        .map((line, index) => {
          const [name, ...rest] = line.split(":");
          return { name: name?.trim(), value: rest.join(":").trim(), sortOrder: index + 1 };
        })
        .filter((item) => item.name && item.value) as ProductAttribute[];

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
        galleryImages: form.galleryText
          .split("\n")
          .map((url, index) => ({ url: url.trim(), alt: form.name, sortOrder: index + 1 }))
          .filter((item) => item.url)
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
        body: JSON.stringify({
          name: categoryName,
          slug: categorySlug,
          description: categoryDescription,
          imageUrl: categoryImageUrl,
          active: categoryActive,
          sortOrder: Number(categorySortOrder || categories.length + 1)
        })
      });
      setNotice(categoryId ? "Kategoriya yangilandi" : "Kategoriya qo'shildi");
      setCategoryId("");
      setCategoryName("");
      setCategorySlug("");
      setCategoryDescription("");
      setCategoryImageUrl("");
      setCategoryActive(true);
      setCategorySortOrder("");
      await load();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Kategoriya saqlanmadi");
    }
  }

  async function removeProduct(id: string) {
    if (!window.confirm("Mahsulotni o'chirishni tasdiqlaysizmi?")) return;
    try {
      await adminFetch(`/admin/products/${id}`, { method: "DELETE" });
      setNotice("Mahsulot o'chirildi");
      await load();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Mahsulot o'chirilmadi");
    }
  }

  async function removeCategory(id: string) {
    if (!window.confirm("Kategoriyani o'chirishni tasdiqlaysizmi?")) return;
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
        body: JSON.stringify({
          ...product,
          categoryId: product.category.id,
          status,
          attributes: product.attributes,
          galleryImages: product.galleryImages
        })
      });
      setNotice(status === "ACTIVE" ? "Mahsulot ko'rsatildi" : "Mahsulot yashirildi");
      await load();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Status yangilanmadi");
    }
  }

  async function uploadImage(file: File, target: "main" | "gallery" = "main") {
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
      const uploadedUrl = normalizeImageUrl(data.url);
      setForm((current) => {
        if (target === "main") return { ...current, mainImageUrl: uploadedUrl };
        const galleryText = [current.galleryText, uploadedUrl].filter(Boolean).join("\n");
        return { ...current, galleryText };
      });
      setNotice(target === "main" ? "Asosiy rasm yuklandi" : "Galereya rasmi qo'shildi");
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

  function clearForm() {
    setForm({ ...emptyForm, categoryId: categories[0]?.id ?? "" });
    setCategoryId("");
    setCategoryName("");
    setCategorySlug("");
    setCategoryDescription("");
    setCategoryImageUrl("");
    setCategoryActive(true);
    setCategorySortOrder("");
  }

  const featuredProducts = useMemo(() => products.filter((item) => item.featured).length, [products]);
  const activeProducts = useMemo(() => products.filter((item) => item.status === "ACTIVE").length, [products]);
  const activePercent = products.length ? Math.round((activeProducts / products.length) * 100) : 0;
  const galleryImages = useMemo(() => form.galleryText.split("\n").map((url) => url.trim()).filter(Boolean), [form.galleryText]);

  if (!token) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7f7f5] p-6">
        <form onSubmit={login} className="w-full max-w-md rounded-[8px] border border-line bg-white p-7 shadow-soft">
          <div className="grid h-12 w-12 place-items-center rounded-[8px] bg-[#fbf3e5] text-brass">
            <Package className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-2xl font-extrabold text-ink">Admin panel</h1>
          <p className="mt-2 text-sm text-muted">Mc PoLOO katalogini boshqarish uchun tizimga kiring.</p>
          <input value={username} onChange={(event) => setUsername(event.target.value)} className="mt-6 h-11 w-full rounded-[8px] border border-line px-3 text-sm outline-none focus:border-brass" placeholder="Login" />
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" className="mt-3 h-11 w-full rounded-[8px] border border-line px-3 text-sm outline-none focus:border-brass" placeholder="Parol" />
          {notice && <p className="mt-3 text-sm font-semibold text-red-600">{notice}</p>}
          <button className="mt-5 h-11 w-full rounded-[8px] bg-ink text-sm font-bold text-white">Kirish</button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-ink">
      <div className="mx-auto flex min-h-screen max-w-[1500px] flex-col px-4 py-4 sm:px-6 lg:px-7">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black leading-tight text-ink">Admin panel</h1>
            <p className="mt-1 text-sm font-medium text-muted">Mc PoLOO katalogini boshqarish</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="grid h-10 w-10 place-items-center rounded-[8px] border border-line bg-white shadow-sm" aria-label="Bildirishnomalar">
              <Bell className="h-4 w-4" />
            </button>
            <div className="hidden h-10 w-px bg-line sm:block" />
            <div className="flex items-center gap-3 rounded-[8px] bg-transparent">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#dfdfdf] text-sm font-black text-white">A</span>
              <span className="hidden leading-tight sm:block">
                <span className="block text-sm font-extrabold">Admin</span>
                <span className="block text-xs font-medium text-muted">Administrator</span>
              </span>
              <ChevronDown className="hidden h-4 w-4 text-muted sm:block" />
            </div>
            <button onClick={logout} className="flex h-10 items-center gap-2 rounded-[8px] border border-line bg-white px-4 text-sm font-bold shadow-sm" aria-label="Chiqish">
              <LogOut className="h-4 w-4" />
              Chiqish
            </button>
          </div>
        </header>

        {notice && (
          <div className="mt-4 rounded-[8px] border border-line bg-white px-4 py-3 text-sm font-bold shadow-sm">
            {notice}
          </div>
        )}

        <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={<Package className="h-5 w-5" />} label="Mahsulotlar soni" value={productPage?.totalElements ?? products.length} helper="Filter bo'yicha jami" />
          <StatCard icon={<Tag className="h-5 w-5" />} label="Kategoriyalar" value={categories.length} helper="Katalog kategoriyalari" />
          <StatCard icon={<CheckCircle2 className="h-5 w-5" />} label="Faol mahsulotlar" value={activeProducts} helper="Joriy sahifadagi aktivlar" percent={activePercent} positive />
          <StatCard icon={<Database className="h-5 w-5" />} label="Top mahsulotlar" value={featuredProducts} helper="Joriy sahifadagi top belgisi" />
        </section>

        <div className="mt-5 grid flex-1 gap-5 xl:grid-cols-[minmax(420px,0.92fr)_minmax(560px,1.08fr)]">
          <section className="rounded-[8px] border border-line bg-white p-5 shadow-sm">
            <SectionTitle icon={<Package className="h-5 w-5" />} title="Mahsulot qo'shish / tahrirlash" subtitle="Yangi mahsulot qo'shing yoki mavjud mahsulotni tahrirlang" />
            <form onSubmit={saveProduct} className="mt-5 grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Nomi" required>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Mc PoLOO" className="admin-input" />
                </Field>
                <Field label="Slug" required>
                  <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="mc-poloo" className="admin-input" />
                </Field>
                <Field label="Model">
                  <input required value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} placeholder="Masalan: R108" className="admin-input" />
                </Field>
                <Field label="Brend">
                  <input required value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="Mc PoLOO" className="admin-input" />
                </Field>
                <Field label="Narx" required>
                  <input required type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="1,450,000" className="admin-input" />
                </Field>
                <Field label="Eski narx">
                  <input type="number" value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} placeholder="Masalan: 1,800,000" className="admin-input" />
                </Field>
                <Field label="Kategoriya" required>
                  <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="admin-input">
                    {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                  </select>
                </Field>
                <Field label="Status">
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ProductStatus })} className="admin-input">
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
                  </select>
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Asosiy rasm" required>
                  <label className="flex min-h-[126px] cursor-pointer flex-col items-center justify-center rounded-[8px] border border-dashed border-[#cfcfcf] bg-[#fbfbfa] p-4 text-center transition hover:border-brass hover:bg-[#fffaf1]">
                    <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => event.target.files?.[0] && uploadImage(event.target.files[0], "main")} className="sr-only" />
                    {form.mainImageUrl ? (
                      <span className="relative h-20 w-20 overflow-hidden rounded-[8px] border border-line bg-white">
                        <ImageWithFallback src={form.mainImageUrl} alt={form.name || "Mahsulot rasmi"} fill sizes="80px" className="object-cover" />
                      </span>
                    ) : (
                      <span className="grid h-10 w-10 place-items-center rounded-[8px] bg-white text-muted">
                        <ImagePlus className="h-5 w-5" />
                      </span>
                    )}
                    <span className="mt-2 text-sm font-extrabold">Rasm yuklash</span>
                    <span className="mt-1 text-xs font-medium text-muted">{form.mainImageUrl ? "Rasm tayyor. Almashtirish uchun qayta tanlang." : "JPG, PNG, WebP. Maksimal 5MB"}</span>
                    <span className="mt-3 rounded-[8px] border border-brass px-5 py-2 text-xs font-extrabold text-brass">Fayl tanlash</span>
                  </label>
                </Field>
                <Field label="Galereya (bir nechta rasm)">
                  <div className="grid min-h-[126px] grid-cols-4 gap-2">
                    {galleryImages.slice(0, 3).map((url) => (
                      <span key={url} className="relative min-h-[92px] overflow-hidden rounded-[8px] border border-line bg-[#f5f5f4]">
                        <ImageWithFallback src={url} alt="Galereya rasmi" fill sizes="92px" className="object-cover" />
                      </span>
                    ))}
                    <label className="flex min-h-[92px] cursor-pointer flex-col items-center justify-center rounded-[8px] border border-dashed border-[#cfcfcf] bg-[#fbfbfa] text-center text-xs font-semibold text-muted">
                      <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => event.target.files?.[0] && uploadImage(event.target.files[0], "gallery")} className="sr-only" />
                      <Plus className="mb-1 h-5 w-5" />
                      Rasm qo&apos;shish
                    </label>
                  </div>
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Xususiyatlar">
                  <textarea value={form.attributesText} onChange={(e) => setForm({ ...form, attributesText: e.target.value })} className="admin-textarea min-h-[118px]" />
                </Field>
                <Field label="Tavsif">
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Zamonaviy dizayn, yuqori sifatli keramika..." className="admin-textarea min-h-[118px]" />
                </Field>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex flex-wrap gap-5">
                  <label className="flex items-center gap-2 text-sm font-bold">
                    <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="h-4 w-4 accent-brass" />
                    Top mahsulot
                  </label>
                  <label className="flex items-center gap-2 text-sm font-bold">
                    <input type="checkbox" checked={form.newArrival} onChange={(e) => setForm({ ...form, newArrival: e.target.checked })} className="h-4 w-4 accent-brass" />
                    Yangi
                  </label>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={clearForm} className="flex h-11 items-center gap-2 rounded-[8px] border border-line bg-white px-5 text-sm font-extrabold">
                    <RotateCcw className="h-4 w-4" />
                    Tozalash
                  </button>
                  <button className="flex h-11 items-center gap-2 rounded-[8px] bg-ink px-6 text-sm font-extrabold text-white shadow-sm">
                    <Save className="h-4 w-4" />
                    Saqlash
                  </button>
                </div>
              </div>
            </form>
          </section>

          <section className="grid content-start gap-5">
            <div className="rounded-[8px] border border-line bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <SectionTitle icon={<Folder className="h-5 w-5" />} title="Kategoriyalar" subtitle="Mahsulot kategoriyalarini boshqarish" />
                <button type="button" onClick={() => { setCategoryId(""); setCategoryName(""); setCategorySlug(""); setCategoryDescription(""); setCategoryImageUrl(""); setCategoryActive(true); setCategorySortOrder(String(categories.length + 1)); }} className="flex h-10 items-center gap-2 rounded-[8px] bg-brass px-5 text-sm font-extrabold text-white shadow-sm">
                  <Plus className="h-4 w-4" />
                  Yangi kategoriya
                </button>
              </div>
              <form onSubmit={saveCategory} className="mt-4 grid gap-3 lg:grid-cols-2">
                <input required value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="Kategoriya nomi" className="admin-input" />
                <input value={categorySlug} onChange={(e) => setCategorySlug(e.target.value)} placeholder="Slug" className="admin-input" />
                <input value={categoryDescription} onChange={(e) => setCategoryDescription(e.target.value)} placeholder="Tavsif" className="admin-input" />
                <input value={categoryImageUrl} onChange={(e) => setCategoryImageUrl(e.target.value)} placeholder="Rasm URL" className="admin-input" />
                <input type="number" value={categorySortOrder} onChange={(e) => setCategorySortOrder(e.target.value)} placeholder="Tartib raqami" className="admin-input" />
                <label className="flex h-11 items-center gap-2 rounded-[8px] border border-line px-3 text-sm font-bold">
                  <input type="checkbox" checked={categoryActive} onChange={(e) => setCategoryActive(e.target.checked)} className="h-4 w-4 accent-brass" />
                  Public saytda ko&apos;rsatish
                </label>
                <button className="h-11 rounded-[8px] bg-ink px-5 text-sm font-extrabold text-white lg:col-span-2">{categoryId ? "Saqlash" : "Qo'shish"}</button>
              </form>
              <div className="mt-4 divide-y divide-line overflow-hidden rounded-[8px] border border-line">
                {categories.map((category, index) => (
                  <div key={category.id} className="grid grid-cols-[34px_1.2fr_1fr_auto] items-center gap-3 bg-white px-3 py-3 text-sm">
                    <span className="grid h-8 w-8 place-items-center rounded-[8px] bg-[#f7f7f5] text-ink">
                      <CategoryIcon index={index} />
                    </span>
                    <span className="font-extrabold">{category.name}</span>
                    <span className="truncate text-xs font-medium text-muted">/{category.slug}</span>
                    <span className="flex items-center gap-2">
                      <span className="hidden min-w-20 text-right text-xs font-semibold text-muted sm:inline">{products.filter((product) => product.category.id === category.id).length} mahsulot</span>
                      <button onClick={() => { setCategoryId(category.id); setCategoryName(category.name); setCategorySlug(category.slug); setCategoryDescription(category.description ?? ""); setCategoryImageUrl(category.imageUrl ?? ""); setCategoryActive(category.active); setCategorySortOrder(String(category.sortOrder)); }} className="grid h-8 w-8 place-items-center rounded-[8px] border border-line bg-white" aria-label="Kategoriya tahrirlash">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button onClick={() => removeCategory(category.id)} className="grid h-8 w-8 place-items-center rounded-[8px] border border-red-100 bg-white text-red-600" aria-label="Kategoriya o'chirish">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[8px] border border-line bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <SectionTitle icon={<Package className="h-5 w-5" />} title="Mahsulotlar ro'yxati" subtitle="Katalogdagi barcha mahsulotlar" />
                <form onSubmit={(event) => { event.preventDefault(); setAdminPage(0); void load(); }} className="flex flex-wrap gap-2">
                  <label className="flex h-11 min-w-[260px] items-center gap-2 rounded-[8px] border border-line bg-white px-3">
                    <Search className="h-4 w-4 text-muted" />
                    <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Mahsulot qidirish..." className="w-full bg-transparent text-sm outline-none" />
                  </label>
                  <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setAdminPage(0); }} className="h-11 rounded-[8px] border border-line bg-white px-3 text-sm font-bold outline-none">
                    <option value="">Barcha status</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
                  </select>
                  <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setAdminPage(0); }} className="h-11 rounded-[8px] border border-line bg-white px-3 text-sm font-bold outline-none">
                    <option value="">Barcha kategoriya</option>
                    {categories.map((category) => <option key={category.id} value={category.slug}>{category.name}</option>)}
                  </select>
                  <button className="flex h-11 items-center gap-2 rounded-[8px] border border-line bg-white px-4 text-sm font-extrabold">
                    <Filter className="h-4 w-4" />
                    Filtr
                  </button>
                </form>
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[780px] text-left text-sm">
                  <thead className="border-b border-line text-[11px] font-black uppercase text-muted">
                    <tr>
                      <th className="py-3 pr-3">Rasm</th>
                      <th className="py-3 pr-3">Nomi</th>
                      <th className="py-3 pr-3">Model</th>
                      <th className="py-3 pr-3">Narx</th>
                      <th className="py-3 pr-3">Status</th>
                      <th className="py-3 pr-3">Amal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="py-3 pr-3">
                          <span className="relative block h-12 w-12 overflow-hidden rounded-[8px] border border-line bg-[#f7f7f5]">
                            <ImageWithFallback src={product.mainImageUrl} alt={product.name} fill sizes="48px" className="object-cover" />
                          </span>
                        </td>
                        <td className="py-3 pr-3">
                          <span className="block font-extrabold">{product.name}</span>
                          <span className="block text-xs font-medium text-muted">{product.category.name}</span>
                        </td>
                        <td className="py-3 pr-3 font-bold">{product.model}</td>
                        <td className="py-3 pr-3 font-bold">{formatPrice(product.price)}</td>
                        <td className="py-3 pr-3">
                          <span className={statusClass(product.status)}>{statusLabels[product.status]}</span>
                        </td>
                        <td className="py-3 pr-3">
                          <div className="flex gap-2">
                            <button onClick={() => edit(product)} className="grid h-9 w-9 place-items-center rounded-[8px] border border-line bg-white" aria-label="Tahrirlash">
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button onClick={() => setStatus(product, product.status === "ACTIVE" ? "INACTIVE" : "ACTIVE")} className="grid h-9 w-9 place-items-center rounded-[8px] border border-line bg-white" aria-label="Yashirish yoki ko'rsatish">
                              <EyeOff className="h-4 w-4" />
                            </button>
                            <button onClick={() => removeProduct(product.id)} className="grid h-9 w-9 place-items-center rounded-[8px] border border-red-100 bg-white text-red-600" aria-label="O'chirish">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs font-semibold text-muted">
                <span>{productPage?.totalElements ?? products.length} tadan {products.length} tasi ko&apos;rsatilmoqda</span>
                <span className="flex items-center gap-2">
                  <button disabled={(productPage?.page ?? 0) <= 0} onClick={() => setAdminPage((page) => Math.max(0, page - 1))} className="grid h-8 w-8 place-items-center rounded-[8px] border border-line bg-[#f7f7f5] text-muted disabled:opacity-40" type="button">&lt;</button>
                  <span className="grid h-8 min-w-8 place-items-center rounded-[8px] border border-brass bg-white px-2 text-brass">{(productPage?.page ?? 0) + 1} / {productPage?.totalPages ?? 1}</span>
                  <button disabled={!productPage || productPage.page >= productPage.totalPages - 1} onClick={() => setAdminPage((page) => page + 1)} className="grid h-8 w-8 place-items-center rounded-[8px] border border-line bg-[#f7f7f5] text-muted disabled:opacity-40" type="button">&gt;</button>
                </span>
              </div>
            </div>

            <div className="rounded-[8px] border border-line bg-white p-5 shadow-sm">
              <div className="grid gap-4 md:grid-cols-[1fr_320px] md:items-center">
                <SectionTitle icon={<ImagePlus className="h-5 w-5" />} title="Rasm yuklash" subtitle="Mahsulot uchun asosiy rasmni fayl sifatida tanlang." />
                <label className="flex min-h-[70px] cursor-pointer items-center justify-center gap-3 rounded-[8px] border border-dashed border-[#cfcfcf] bg-[#fbfbfa] px-4 text-center">
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => event.target.files?.[0] && uploadImage(event.target.files[0], "main")} className="sr-only" />
                  <UploadCloud className="h-7 w-7 text-muted" />
                  <span className="text-sm">
                    <span className="block font-extrabold">Faylni bu yerga tashlang</span>
                    <span className="block text-xs font-semibold text-brass">yoki tanlang</span>
                  </span>
                </label>
              </div>
            </div>
          </section>
        </div>

        <footer className="mt-4 flex flex-wrap items-center justify-between gap-2 px-1 pb-1 text-xs font-semibold text-muted">
          <span>Mc PoLOO Santexnika</span>
          <span>Sifat uyingizda ham bo&apos;ladi</span>
        </footer>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  helper,
  percent,
  positive
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  helper: string;
  percent?: number;
  positive?: boolean;
}) {
  return (
    <div className="rounded-[8px] border border-line bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-[8px] ${positive ? "bg-green-50 text-green-600" : "bg-[#fbf3e5] text-brass"}`}>
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold text-ink">{label}</p>
          <div className="mt-1 flex items-end justify-between gap-3">
            <p className="truncate text-3xl font-black leading-none">{value}</p>
            {typeof percent === "number" && <span className="text-xs font-bold text-muted">{percent}%</span>}
          </div>
          <p className="mt-2 text-xs font-medium text-muted">{helper}</p>
          {typeof percent === "number" && (
            <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-line">
              <span className="block h-full rounded-full bg-green-600" style={{ width: `${percent}%` }} />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ icon, title, subtitle }: { icon: ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] bg-[#fbf3e5] text-brass">
        {icon}
      </span>
      <span>
        <h2 className="text-lg font-black leading-tight">{title}</h2>
        <p className="mt-1 text-xs font-medium text-muted">{subtitle}</p>
      </span>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-extrabold">
      <span>
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {children}
    </label>
  );
}

function CategoryIcon({ index }: { index: number }) {
  const icons = [
    <Box key="box" className="h-4 w-4" />,
    <Package key="package" className="h-4 w-4" />,
    <Database key="database" className="h-4 w-4" />,
    <Tag key="tag" className="h-4 w-4" />,
    <Folder key="folder" className="h-4 w-4" />
  ];
  return icons[index % icons.length];
}

function statusClass(status: ProductStatus) {
  const base = "inline-flex items-center rounded-full px-3 py-1 text-xs font-black";
  if (status === "ACTIVE") return `${base} bg-green-50 text-green-700`;
  if (status === "OUT_OF_STOCK") return `${base} bg-amber-50 text-amber-700`;
  return `${base} bg-[#f2f2f1] text-muted`;
}
