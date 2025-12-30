// src/engine/stores/gameState/useStore.ts
"use client"

import { internalStore } from "./internalStore"

/**
 * useGameStateStore - GameState状態へのアクセスフック
 *
 * コンポーネントからGameState状態を参照する場合に使用。
 */
export function useGameStateStore() {
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
