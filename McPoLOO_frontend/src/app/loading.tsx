import { ProductSkeleton } from "@/components/product/ProductSkeleton";

export default function Loading() {
  return (
    <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-3 p-4 sm:grid-cols-3 lg:grid-cols-5">
      {Array.from({ length: 10 }).map((_, index) => <ProductSkeleton key={index} />)}
    </div>
  );
}
