"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center bg-porcelain p-6 text-center">
      <div>
        <h1 className="text-3xl font-extrabold">Xatolik yuz berdi</h1>
        <p className="mt-3 text-muted">Sahifani qayta yuklab ko&apos;ring.</p>
        <button onClick={reset} className="mt-6 inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm font-bold text-white">Qayta urinish</button>
      </div>
    </main>
  );
}
