// src/engine/stores/playState/internalStore.ts
"use client"

import { create } from "zustand"

/**
 * 再生位置（エンジン共通フォーマット）
 */
export type Playhead = {
  sceneId: string
  fragmentId: string
  nodeIndex: number
}

/**
 * PlayStateストアの状態型
 */
export type PlayStateStoreState = {
  /** 再生位置（エンジン共通） */
  playhead: Playhead | null
  /** シナリオ固有データ（完全自由形式） */
  playState: unknown
}

/**
 * PlayStateストアのアクション型
 */
type PlayStateActions = {
  /** playhead を設定 */
  setPlayhead: (playhead: Playhead) => void
  /** playState を設定 */
  setPlayState: (playState: unknown) => void
  /** セーブデータから一括ロード */
  loadFromSave: (playhead: Playhead, playState: unknown) => void
  /** リセット */
  reset: () => void
}

const initialState: PlayStateStoreState = {
  playhead: null,
  playState: null,
}

/**
 * PlayState状態ストア（内部実装）
 *
 * 直接使用禁止。useStore.ts 経由でアクセスすること。
 */
export const internalStore = create<PlayStateStoreState & PlayStateActions>((set) => ({
  ...initialState,

  setPlayhead: (playhead) => set({ playhead }),

  setPlayState: (playState) => set({ playState }),

  loadFromSave: (playhead, playState) => set({ playhead, playState }),

  reset: () => set(initialState),
}))
