"use client";

import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { siteConfig } from "@/utils/site-config";

const nav = [
  ["Katalog", "/catalog"],
  ["Kategoriyalar", "/catalog"],
  ["Kontaktlar", "#contact"],
  ["Admin", "/admin"]
];

export function Header() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  function submit() {
    if (query.trim().length > 1) {
      setOpen(false);
      router.push(`/catalog?q=${encodeURIComponent(query.trim())}`);
    }
  }
  
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm font-semibold text-muted lg:flex">
          {nav.map(([label, href]) => <Link key={label} href={href} className="transition hover:text-ink">{label}</Link>)}
        </nav>
        <div className="hidden h-11 w-72 items-center gap-2 rounded-full border border-line bg-porcelain px-4 lg:flex">
          <Search className="h-4 w-4 text-muted" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === "Enter" && submit()} placeholder="Model yoki kategoriya..." className="w-full bg-transparent text-sm outline-none placeholder:text-muted" />
        </div>
        <span className="hidden whitespace-nowrap border-2 border-red-500 bg-white px-4 py-3 text-xs font-bold text-red-600 shadow-md xl:block">Murojaat uchun: {siteConfig.phone}</span>
        <button onClick={() => setOpen(true)} className="focus-ring grid h-11 w-11 place-items-center rounded-full border border-line lg:hidden" aria-label="Menyuni ochish">
          <Menu className="h-5 w-5" />
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 bg-white p-5 lg:hidden">
          <div className="flex items-center justify-between">
            <Logo />
            <button onClick={() => setOpen(false)} className="grid h-11 w-11 place-items-center rounded-full border border-line" aria-label="Menyuni yopish">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-8 flex items-center gap-3 rounded-full border border-line bg-porcelain px-4 py-3">
            <Search className="h-4 w-4 text-muted" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === "Enter" && submit()} placeholder="Qidirish" className="w-full bg-transparent outline-none" />
          </div>
          <nav className="mt-8 grid gap-5 text-lg font-semibold">
            {nav.map(([label, href]) => <Link onClick={() => setOpen(false)} key={label} href={href}>{label}</Link>)}
          </nav>
        </div>
      )}
    </header>
  );
}
