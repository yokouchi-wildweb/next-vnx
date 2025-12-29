/**
 * useDialogue - Dialogue 状態の読み取り用フック
 */
"use client"

import { useDialogueStore } from "../stores"

/** Dialogue 状態を取得する */
export function useDialogue() {
  const { messages, currentSpeaker, leftCharacter, rightCharacter } =
    useDialogueStore()

  return {
    messages,
    currentSpeaker,
    leftCharacter,
    rightCharacter,
  }
}
