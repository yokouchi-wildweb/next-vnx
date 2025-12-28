// src/engine/features/Dialogue/hooks/useDialogue.ts
"use client"

import { useDialogueStore } from "../stores"

/**
 * useDialogue - Dialogue 状態読み取り用フック
 *
 * Widget/Sprite から状態を参照する場合に使用。
 */
export function useDialogue() {
  const { messages, currentSpeaker } = useDialogueStore()

  return {
    messages,
    currentSpeaker,
  }
}
