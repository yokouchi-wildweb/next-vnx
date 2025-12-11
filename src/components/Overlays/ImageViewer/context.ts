// src/components/Overlays/ImageViewer/context.ts

"use client";

import { createContext, useContext } from "react";

export type ImageViewerContextValue = {
  openImage: (src: string, alt?: string) => void;
};

export const ImageViewerContext = createContext<ImageViewerContextValue | null>(null);

export function useImageViewer(): ImageViewerContextValue {
  const context = useContext(ImageViewerContext);
  if (!context) {
    throw new Error("useImageViewer must be used within an ImageViewerProvider");
  }
  return context;
}
