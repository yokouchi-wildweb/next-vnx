// src/stores/useAppToastStore.ts

"use client";

import { create } from "zustand";
import type { ReactNode } from "react";

export type AppToastMode = "notification" | "persistent";

export type AppToastVariant =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "loading"
  | "primary"
  | "secondary"
  | "accent";

export type AppToastIconPreset = "success" | "error" | "warning" | "info" | "loading";

export type AppToastPosition =
  | "center"
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type AppToastSize = "sm" | "md" | "lg";

export type AppToastItem = {
  id: string;
  message: string;
  variant: AppToastVariant;
  mode: AppToastMode;
  position: AppToastPosition;
  duration: number;
  size: AppToastSize;
  spinning: boolean;
  icon?: AppToastIconPreset | ReactNode;
};

export type AppToastOptions = {
  message: string;
  variant?: AppToastVariant;
  mode?: AppToastMode;
  position?: AppToastPosition;
  duration?: number;
  size?: AppToastSize;
  spinning?: boolean;
  icon?: AppToastIconPreset | ReactNode;
};

type AppToastState = {
  toast: AppToastItem | null;
  show: (options: AppToastOptions) => void;
  hide: () => void;
};

export const useAppToastStore = create<AppToastState>((set) => ({
  toast: null,
  show: (options) => {
    const mode = options.mode ?? "notification";
    const isPersistent = mode === "persistent";

    // persistentモードのデフォルト値
    const variant = options.variant ?? (isPersistent ? "loading" : "info");
    const isLoading = variant === "loading";
    const spinning = options.spinning ?? (isPersistent || isLoading);
    const position = options.position ?? (isPersistent ? "bottom-center" : "center");

    set({
      toast: {
        id: crypto.randomUUID(),
        message: options.message,
        variant,
        mode,
        position,
        duration: options.duration ?? 3000,
        size: options.size ?? "md",
        spinning,
        icon: options.icon,
      },
    });
  },
  hide: () => set({ toast: null }),
}));
