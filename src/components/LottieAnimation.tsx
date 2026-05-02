"use client";

import lottie from "lottie-web";
import { useEffect, useRef } from "react";

type LottieAnimationProps = {
  ariaLabel?: string;
  className?: string;
  path: string;
};

export function LottieAnimation({ ariaLabel, className, path }: LottieAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const animation = lottie.loadAnimation({
      autoplay: true,
      container: containerRef.current,
      loop: true,
      path,
      renderer: "svg",
      rendererSettings: {
        preserveAspectRatio: "xMidYMid meet",
      },
    });

    return () => animation.destroy();
  }, [path]);

  return <div aria-label={ariaLabel} className={className} ref={containerRef} role={ariaLabel ? "img" : undefined} />;
}
