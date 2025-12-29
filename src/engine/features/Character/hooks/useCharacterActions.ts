/**
 * useCharacterActions - Character 状態更新フック
 */
"use client"

import { useCharacterStore } from "../stores"

/**
 * キャラクター操作アクションを取得
 */
export function useCharacterActions() {
  const { initialize, show, hide, move, setSprite, setSpeaker, reset } =
    useCharacterStore()

  return {
    initialize,
    show,
    hide,
    move,
    setSprite,
    setSpeaker,
    reset,
  }
}
