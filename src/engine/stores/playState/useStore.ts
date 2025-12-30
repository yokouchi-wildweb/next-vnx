// src/engine/stores/playState/useStore.ts
"use client"

import { internalStore } from "./internalStore"

/**
 * usePlayStateStore - PlayState状態へのアクセスフック
 *
 * コンポーネントからPlayState状態を参照する場合に使用。
 */
export function usePlayStateStore() {
  const playhead = internalStore((s) => s.playhead)
  const playState = internalStore((s) => s.playState)
  const setPlayhead = internalStore((s) => s.setPlayhead)
  const setPlayState = internalStore((s) => s.setPlayState)
  const loadFromSave = internalStore((s) => s.loadFromSave)
  const reset = internalStore((s) => s.reset)

  return {
    playhead,
    playState,
    setPlayhead,
    setPlayState,
    loadFromSave,
    reset,
  }
}
