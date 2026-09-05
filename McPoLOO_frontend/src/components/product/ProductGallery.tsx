"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "@/components/product/ImageWithFallback";
import { Product } from "@/types/catalog";

export function ProductGallery({ product }: { product: Product }) {
  const images = [{ url: product.mainImageUrl, alt: product.name, sortOrder: 0 }, ...product.galleryImages];
  const [active, setActive] = useState(images[0]);
  const [zoom, setZoom] = useState(false);

  return (
    <div>
      <button onClick={() => setZoom(true)} className="relative aspect-square w-full overflow-hidden rounded-lg border border-line bg-porcelain">
        <ImageWithFallback src={active.url} alt={active.alt || product.name} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-contain p-8" />
      </button>
      <div className="mt-4 grid grid-cols-5 gap-3">
        {images.map((image) => (
          <button key={`${image.url}-${image.sortOrder}`} onClick={() => setActive(image)} className="relative aspect-square overflow-hidden rounded-lg border border-line bg-white">
            <ImageWithFallback src={image.url} alt={image.alt || product.name} fill sizes="100px" className="object-contain p-2" />
          </button>
        ))}
      </div>
      {zoom && (
        <div className="fixed inset-0 z-50 bg-white p-4">
          <button onClick={() => setZoom(false)} className="absolute right-5 top-5 z-10 grid h-11 w-11 place-items-center rounded-full border border-line bg-white" aria-label="Zoom yopish">
            <X className="h-5 w-5" />
          </button>
          <div className="relative h-full w-full">
            <ImageWithFallback src={active.url} alt={active.alt || product.name} fill sizes="100vw" className="object-contain p-4" />
          </div>
        </div>
      )}
    </div>
  );
}
