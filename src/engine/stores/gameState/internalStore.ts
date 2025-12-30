// src/engine/stores/gameState/internalStore.ts
"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

/**
 * 再生位置（エンジン共通フォーマット）
 */
export type Playhead = {
  sceneId: string
  fragmentId: string
  nodeIndex: number
}

/**
 * GameStateストアの状態型
 */
export type GameStateStoreState = {
  /** 再生位置（エンジン共通） */
  playhead: Playhead | null
  /** シナリオ固有データ（完全自由形式） */
  playState: unknown
}

/**
 * GameStateストアのアクション型
 */
type GameStateActions = {
  /** playhead を設定 */
  setPlayhead: (playhead: Playhead) => void
  /** playState を設定 */
  setPlayState: (playState: unknown) => void
  /** セーブデータから一括ロード */
  loadFromSave: (playhead: Playhead, playState: unknown) => void
  /** リセット */
  reset: () => void
}

const initialState: GameStateStoreState = {
  playhead: null,
  playState: null,
}

/**
 * GameState状態ストア（内部実装）
 *
 * 直接使用禁止。useStore.ts 経由でアクセスすること。
 * localStorage に自動永続化される（リロード対策）
 */
export const internalStore = create<GameStateStoreState & GameStateActions>()(
  persist(
    (set) => ({
      ...initialState,

      setPlayhead: (playhead) => set({ playhead }),

      setPlayState: (playState) => set({ playState }),

      loadFromSave: (playhead, playState) => set({ playhead, playState }),

      reset: () => set(initialState),
    }),
    {
      name: "vnx-game-state", // localStorage のキー名
    }
  )
)
