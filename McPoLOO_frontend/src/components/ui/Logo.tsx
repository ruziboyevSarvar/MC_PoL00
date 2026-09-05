import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="Mc PoLOO bosh sahifa">
      <span className="grid h-11 w-11 place-items-center rounded-lg border border-line bg-ink text-[11px] font-black tracking-wide text-white shadow-sm">
        MC
      </span>
      <span className="leading-none">
        <span className="block text-lg font-black tracking-wide text-ink">Mc PoLOO</span>
        <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-brass">Sanitary ware</span>
      </span>
    </Link>
  );
}
