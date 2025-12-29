/**
 * Background Store フック
 */
"use client"

import { internalStore } from "./internalStore"

/**
 * Background ストアの状態とアクションを取得
 */
export function useBackgroundStore() {
  return internalStore()
}
