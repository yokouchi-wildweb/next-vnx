// src/engine/stores/bgm/internalStore.ts
"use client"

import { create } from "zustand"

/**
 * BGMストアの状態型
 */
export type BgmState = {
  /** 現在再生中のBGMキー（nullなら未再生） */
  currentBgmKey: string | null
  /** 現在の音量（0-1） */
  volume: number
  /** 再生中かどうか */
  isPlaying: boolean
}

/**
 * BGMストアのアクション型
 */
type BgmActions = {
  /** 状態を更新（内部用） */
  _setState: (state: Partial<BgmState>) => void
  /** 音量を更新 */
  setVolume: (volume: number) => void
  /** リセット */
  reset: () => void
}

const initialState: BgmState = {
  currentBgmKey: null,
  volume: 0.5,
  isPlaying: false,
}

/**
 * BGM状態ストア（内部実装）
 *
 * 直接使用禁止。useStore.ts 経由でアクセスすること。
 * 例外: bgmManager（エンジン内部ロジック）からの getState/setState
 */
export const internalStore = create<BgmState & BgmActions>((set) => ({
  ...initialState,

  _setState: (state) => set(state),

  setVolume: (volume) => set({ volume }),

  reset: () => set(initialState),
}))
