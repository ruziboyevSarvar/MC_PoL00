import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ImageWithFallback } from "@/components/product/ImageWithFallback";
import { Product } from "@/types/catalog";
import { formatPrice } from "@/utils/format";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group overflow-hidden rounded-lg border border-line bg-white transition duration-200 hover:-translate-y-1 hover:shadow-soft">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] bg-porcelain">
          <ImageWithFallback src={product.mainImageUrl} alt={product.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-contain p-5 transition duration-300 group-hover:scale-[1.03]" />
          <div className="absolute left-3 top-3 flex gap-2">
            {product.newArrival && <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-ink shadow-sm">Yangi</span>}
            {product.featured && <span className="rounded-full bg-ink px-3 py-1 text-[11px] font-bold text-white">Top</span>}
            {product.status === "OUT_OF_STOCK" && <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-muted shadow-sm">Mavjud emas</span>}
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-brass">{product.brand}</p>
              <h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-bold text-ink sm:text-base">{product.name}</h3>
            </div>
            <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted transition group-hover:text-ink" />
          </div>
          <p className="mt-2 text-xs text-muted">Model: {product.model}</p>
          <div className="mt-3">
            {product.oldPrice && <p className="text-xs font-semibold text-muted line-through">{formatPrice(product.oldPrice)}</p>}
            <p className="text-base font-extrabold text-ink">{formatPrice(product.price)}</p>
          </div>
        </div>
      </Link>
    </article>
  );
}
