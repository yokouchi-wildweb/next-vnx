// stores/globalLoader/useStore.ts

"use client";

import { internalStore } from "./internalStore";

export function useGlobalLoaderStore() {
  const isVisible = internalStore((s) => s.isVisible);
  const options = internalStore((s) => s.options);
  const setVisible = internalStore((s) => s.setVisible);
  const setOptions = internalStore((s) => s.setOptions);

  return { isVisible, options, setVisible, setOptions };
}
