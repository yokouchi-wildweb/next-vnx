// src/engine/features/Dialogue/hooks/useDialogueActions.ts
"use client"

import { useDialogueStore } from "../stores"

/**
 * useDialogueActions - Dialogue 状態更新用フック
 *
 * Executor から状態を更新する場合に使用。
 */
export function useDialogueActions() {
  const { addMessage, setSpeaker, clear, reset } = useDialogueStore()

  return {
    addMessage,
    setSpeaker,
    clear,
    reset,
  }
}
