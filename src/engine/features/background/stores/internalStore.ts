/**
 * Background Store（内部実装）
 *
 * 直接使用禁止。useStore.ts 経由でアクセスすること。
 */
"use client"

import { create } from "zustand"
import type { BackgroundState } from "../types"

/** Background ストアのアクション */
type BackgroundActions = {
  /** 初期化（backgrounds の value は完全パス） */
  initialize: (backgrounds: Record<string, string>, initialKey?: string) => void
  /** 背景を変更 */
  setBackground: (key: string) => void
  /** リセット */
  reset: () => void
}

const initialState: BackgroundState = {
  backgrounds: {},
  currentKey: null,
}

export const internalStore = create<BackgroundState & BackgroundActions>(
  (set) => ({
    ...initialState,

    initialize: (backgrounds, initialKey) =>
      set({
        backgrounds,
        currentKey: initialKey ?? Object.keys(backgrounds)[0] ?? null,
      }),

    setBackground: (key) =>
      set((state) => {
        if (!(key in state.backgrounds)) {
          console.warn(`Background key not found: ${key}`)
          return state
        }
        return { currentKey: key }
      }),

    reset: () => set(initialState),
  })
)
