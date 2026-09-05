import { ProductCard } from "@/components/product/ProductCard";
import { Product } from "@/types/catalog";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="grid min-h-72 place-items-center rounded-lg border border-dashed border-line bg-porcelain p-8 text-center">
        <div>
          <h3 className="text-xl font-bold">Mahsulot topilmadi</h3>
          <p className="mt-2 text-sm text-muted">Qidiruv yoki filterlarni tozalab qayta urinib ko&apos;ring.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
  );
}
