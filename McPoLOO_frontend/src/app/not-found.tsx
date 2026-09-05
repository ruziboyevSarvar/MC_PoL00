import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-porcelain p-6 text-center">
      <div>
        <h1 className="text-3xl font-extrabold">Sahifa topilmadi</h1>
        <p className="mt-3 text-muted">Katalogga qaytib, kerakli mahsulotni qidirib ko&apos;ring.</p>
        <Link href="/catalog" className="mt-6 inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm font-bold text-white">Katalogga o&apos;tish</Link>
      </div>
    </main>
  );
}
