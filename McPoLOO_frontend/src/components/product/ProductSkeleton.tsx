export function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-white">
      <div className="aspect-[4/3] animate-pulse bg-porcelain" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-20 animate-pulse rounded bg-porcelain" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-porcelain" />
        <div className="h-3 w-24 animate-pulse rounded bg-porcelain" />
        <div className="h-5 w-28 animate-pulse rounded bg-porcelain" />
      </div>
    </div>
  );
}
