"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

type Props = Omit<ImageProps, "alt"> & {
  alt: string;
};

export function ImageWithFallback(props: Props) {
  const { alt, ...imageProps } = props;
  const [failed, setFailed] = useState(false);
  if (failed || !imageProps.src) {
    return (
      <div role="img" aria-label={alt} className="flex h-full w-full items-center justify-center bg-gradient-to-br from-porcelain to-white text-center text-sm font-semibold text-muted">
        Mc PoLOO<br />image
      </div>
    );
  }
  return <Image {...imageProps} alt={alt} onError={() => setFailed(true)} />;
}
