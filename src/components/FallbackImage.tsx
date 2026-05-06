"use client";

import type { ReactNode } from "react";
import { useState } from "react";

type FallbackImageProps = {
  alt: string;
  className?: string;
  fallback: ReactNode;
  src: string;
};

export function FallbackImage({ alt, className, fallback, src }: FallbackImageProps) {
  const [hasFailed, setHasFailed] = useState(false);

  if (hasFailed) {
    return (
      <span aria-hidden={alt === ""} className={className}>
        {fallback}
      </span>
    );
  }

  return <img alt={alt} className={className} onError={() => setHasFailed(true)} src={src} />;
}
