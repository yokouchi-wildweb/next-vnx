// src/engine/features/Dialogue/stores/useStore.ts
"use client"

import { internalStore } from "./internalStore"

/**
 * useDialogueStore - Dialogue 状態へのアクセスフック
 *
 * コンポーネントから Dialogue 状態を参照・更新する場合に使用。
 */
export function useDialogueStore() {
  const messages = internalStore((s) => s.messages)
  const currentSpeaker = internalStore((s) => s.currentSpeaker)
  const addMessage = internalStore((s) => s.addMessage)
  const setSpeaker = internalStore((s) => s.setSpeaker)
  const clear = internalStore((s) => s.clear)
  const reset = internalStore((s) => s.reset)

  return {
    // 状態
    messages,
    currentSpeaker,
    // アクション
    addMessage,
    setSpeaker,
    clear,
    reset,
  }
}
