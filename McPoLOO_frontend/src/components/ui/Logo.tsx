import Link from "next/link";
import Image from "next/image";

export function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center" aria-label="Mc PoLOO bosh sahifa">
      <Image
        src="/images/mcpoloo-logo.png"
        alt="Mc PoLOO"
        width={184}
        height={76}
        priority
        className="h-12 w-auto object-contain"
      />
    </Link>
  );
}
