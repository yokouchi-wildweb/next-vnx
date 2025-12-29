/**
 * useCharacter - Character 状態読み取りフック
 */
"use client"

import { useCharacterStore } from "../stores"

/**
 * キャラクター情報を取得
 */
export function useCharacter() {
  const { characterConfigs, displayStates, currentSpeaker } =
    useCharacterStore()

  return {
    /** キャラクター設定 */
    characterConfigs,
    /** 表示状態 */
    displayStates,
    /** 現在の話者 */
    currentSpeaker,
    /** 表示中のキャラクター一覧 */
    visibleCharacters: Object.entries(displayStates)
      .filter(([, state]) => state.visible)
      .map(([id]) => id),
  }
}
