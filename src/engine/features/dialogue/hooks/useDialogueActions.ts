/**
 * useDialogueActions - Dialogue 状態の書き込み用フック
 */
"use client"

import { useDialogueStore } from "../stores"

/** Dialogue 操作アクションを取得する */
export function useDialogueActions() {
  const {
    addMessage,
    clearMessages,
    setSpeaker,
    setLeftCharacter,
    setRightCharacter,
    reset,
  } = useDialogueStore()

  return {
    addMessage,
    clearMessages,
    setSpeaker,
    setLeftCharacter,
    setRightCharacter,
    reset,
  }
}
