/**
 * useBackgroundActions - Background 操作フック
 */
"use client"

import { useBackgroundStoreActions } from "../stores"

/**
 * 背景操作アクションを取得
 */
export function useBackgroundActions() {
  const { initialize, setBackground, reset } = useBackgroundStoreActions()

  return {
    /** 初期化（backgrounds の value は完全パス） */
    initialize,
    /** 背景を変更 */
    setBackground,
    /** リセット */
    reset,
  }
}
