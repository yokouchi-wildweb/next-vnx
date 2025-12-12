// src/stores/useGlobalLoaderStore.ts

"use client";

import { create } from "zustand";
import type { ReactNode } from "react";
import type { SpinnerVariant } from "@/components/Overlays/Loading/Spinner";

type LoaderOptions = {
  message?: ReactNode;
  spinnerVariant?: SpinnerVariant;
  spinnerClassName?: string;
  messageClassName?: string;
  className?: string;
  zIndex?: number;
};

type GlobalLoaderState = {
  isVisible: boolean;
  options: LoaderOptions;
  showLoader: (options?: string | LoaderOptions) => void;
  hideLoader: () => void;
};

export const useGlobalLoaderStore = create<GlobalLoaderState>((set) => ({
  isVisible: false,
  options: {},
  showLoader: (options) => {
    const resolved: LoaderOptions =
      typeof options === "string" ? { message: options } : options ?? {};
    set({ isVisible: true, options: resolved });
  },
  hideLoader: () => set({ isVisible: false, options: {} }),
}));
