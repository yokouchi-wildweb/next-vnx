// src/engine/stores/bgm/useStore.ts
"use client"

import { internalStore } from "./internalStore"

/**
 * useBgmStore - BGM状態へのアクセスフック
 *
 * コンポーネントからBGM状態を参照する場合に使用。
 * 再生ロジックは bgmManager を使用すること。
 */
export function useBgmStore() {
  const currentBgmKey = internalStore((s) => s.currentBgmKey)
  const volume = internalStore((s) => s.volume)
  const isPlaying = internalStore((s) => s.isPlaying)
  const setVolume = internalStore((s) => s.setVolume)

  return {
    currentBgmKey,
    volume,
    isPlaying,
    setVolume,
  }
}
