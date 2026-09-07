import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center" aria-label="Mc PoLOO bosh sahifa">
      <span className="block leading-none">
        <span className="block text-[26px] font-black tracking-normal text-ink sm:text-[30px]">
          McPoLOO
        </span>
        <span className="mt-1 grid h-1.5 w-full grid-cols-[1fr_1fr_1fr] overflow-hidden rounded-full">
          <span className="bg-[#006b45]" />
          <span className="bg-white" />
          <span className="bg-[#d91f2b]" />
        </span>
        <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.12em] text-muted">
          Premium sanitary ware
        </span>
      </span>
    </Link>
  );
}
