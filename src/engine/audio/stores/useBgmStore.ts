// src/engine/audio/stores/useBgmStore.ts

import { Howl } from "howler"
import { create } from "zustand"

/**
 * BGMストアの状態型
 */
type BgmState = {
  /** 現在再生中のBGMキー（nullなら未再生） */
  currentBgmKey: string | null
  /** 現在のHowlインスタンス */
  howlInstance: Howl | null
  /** 現在の音量（0-1） */
  volume: number
}

/**
 * BGMストアのアクション型
 */
type BgmActions = {
  /** BGMを再生（既存があれば停止してから） */
  play: (key: string, src: string, options?: { loop?: boolean; volume?: number }) => void
  /** BGMを停止 */
  stop: () => void
  /** BGMを一時停止 */
  pause: () => void
  /** BGMを再開 */
  resume: () => void
  /** 音量を設定 */
  setVolume: (volume: number) => void
  /** フェードアウトして停止 */
  fadeOut: (duration?: number) => Promise<void>
}

/**
 * useBgmStore - グローバルBGM状態管理
 *
 * アプリ全体で1つのBGMのみ再生されることを保証する。
 * 新しいBGMを再生すると、既存のBGMは自動停止される。
 */
export const useBgmStore = create<BgmState & BgmActions>((set, get) => ({
  currentBgmKey: null,
  howlInstance: null,
  volume: 0.5,

  play: (key, src, options = {}) => {
    const { loop = true, volume } = options
    const state = get()
    const effectiveVolume = volume ?? state.volume

    // 同じBGMが既に再生中なら何もしない
    if (state.currentBgmKey === key && state.howlInstance?.playing()) {
      return
    }

    // 既存のBGMを停止
    if (state.howlInstance) {
      state.howlInstance.stop()
      state.howlInstance.unload()
    }

    // 新しいBGMを作成・再生
    const howl = new Howl({
      src: [src],
      loop,
      volume: effectiveVolume,
      html5: true, // 大きなファイルのストリーミング用
    })

    howl.play()

    set({
      currentBgmKey: key,
      howlInstance: howl,
      volume: effectiveVolume,
    })
  },

  stop: () => {
    const { howlInstance } = get()
    if (howlInstance) {
      howlInstance.stop()
      howlInstance.unload()
    }
    set({
      currentBgmKey: null,
      howlInstance: null,
    })
  },

  pause: () => {
    const { howlInstance } = get()
    if (howlInstance) {
      howlInstance.pause()
    }
  },

  resume: () => {
    const { howlInstance } = get()
    if (howlInstance) {
      howlInstance.play()
    }
  },

  setVolume: (volume) => {
    const { howlInstance } = get()
    if (howlInstance) {
      howlInstance.volume(volume)
    }
    set({ volume })
  },

  fadeOut: (duration = 1000) => {
    return new Promise<void>((resolve) => {
      const { howlInstance } = get()
      if (!howlInstance) {
        resolve()
        return
      }

      const currentVolume = howlInstance.volume()
      howlInstance.fade(currentVolume, 0, duration)

      setTimeout(() => {
        get().stop()
        resolve()
      }, duration)
    })
  },
}))
