// src/engine/stores/useBgmStore.ts

import { create } from "zustand"

/**
 * BGMストアの状態型
 * 純粋な状態のみ、ロジックは bgmManager に分離
 */
type BgmState = {
  /** 現在再生中のBGMキー（nullなら未再生） */
  currentBgmKey: string | null
  /** 現在の音量（0-1） */
  volume: number
  /** 再生中かどうか */
  isPlaying: boolean
}

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
 * useBgmStore - BGM状態管理
 *
 * 状態のみを管理。実際の再生ロジックは bgmManager を使用すること。
 */
export const useBgmStore = create<BgmState & BgmActions>((set) => ({
  ...initialState,

  _setState: (state) => set(state),

  setVolume: (volume) => set({ volume }),

  reset: () => set(initialState),
}))
