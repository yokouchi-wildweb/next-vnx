// src/components/Overlays/ImageViewer/ZoomableImage.tsx

"use client";

import { type CSSProperties, type MouseEvent } from "react";
import { useImageViewer } from "./context";

type ZoomableImageProps = {
  src: string;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  width?: number | string;
  height?: number | string;
};

export function ZoomableImage({
  src,
  alt = "",
  className,
  style,
  width,
  height,
}: ZoomableImageProps) {
  const { openImage } = useImageViewer();

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    openImage(src, alt);
  };

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      style={{ ...style, cursor: "zoom-in" }}
      width={width}
      height={height}
      onClick={handleClick}
    />
  );
}
