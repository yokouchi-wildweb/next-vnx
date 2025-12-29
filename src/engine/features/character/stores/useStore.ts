/**
 * Character Store フック
 */
"use client"

import { internalStore } from "./internalStore"

/**
 * Character ストアの状態とアクションを取得
 */
export function useCharacterStore() {
  return internalStore()
}
