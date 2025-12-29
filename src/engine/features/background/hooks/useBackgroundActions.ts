/**
 * useBackgroundActions - Background 状態更新フック
 */
"use client"

import { useBackgroundStore } from "../stores"

/**
 * 背景操作アクションを取得
 */
export function useBackgroundActions() {
  const { initialize, setBackground, reset } = useBackgroundStore()

  return {
    initialize,
    setBackground,
    reset,
  }
}
