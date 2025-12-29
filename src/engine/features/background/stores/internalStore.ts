/**
 * Background Store（内部実装）
 *
 * 直接使用禁止。useStore.ts 経由でアクセスすること。
 */
"use client"

import { create } from "zustand"

/** Background ストアの状態 */
export type BackgroundState = {
  /** 背景バリエーション */
  backgrounds: Record<string, string>
  /** 現在の背景キー */
  currentBackground: string | null
}

/** Background ストアのアクション */
type BackgroundActions = {
  /** 初期化 */
  initialize: (backgrounds: Record<string, string>, initial?: string) => void
  /** 背景を変更 */
  setBackground: (key: string) => void
  /** リセット */
  reset: () => void
}

const initialState: BackgroundState = {
  backgrounds: {},
  currentBackground: null,
}

export const internalStore = create<BackgroundState & BackgroundActions>(
  (set) => ({
    ...initialState,

    initialize: (backgrounds, initial) =>
      set({
        backgrounds,
        currentBackground: initial ?? Object.keys(backgrounds)[0] ?? null,
      }),

    setBackground: (key) =>
      set((state) => {
        if (!(key in state.backgrounds)) {
          console.warn(`Background key not found: ${key}`)
          return state
        }
        return { currentBackground: key }
      }),

    reset: () => set(initialState),
  })
)
