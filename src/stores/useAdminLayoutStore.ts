// src/stores/useAdminLayoutStore.ts

"use client";

import { create } from "zustand";

type AdminLayoutState = {
  /** 追加で適用するクラス名 */
  extraClassName: string | undefined;
  /** クラス名を設定 */
  setExtraClassName: (className: string | undefined) => void;
};

/**
 * AdminOuterLayout に追加クラスを適用するためのストア
 * 子コンポーネントから親レイアウトのスタイルを制御する用途
 */
export const useAdminLayoutStore = create<AdminLayoutState>((set) => ({
  extraClassName: undefined,
  setExtraClassName: (className) => set({ extraClassName: className }),
}));
