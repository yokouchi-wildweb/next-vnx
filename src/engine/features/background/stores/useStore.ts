/**
 * Background Store 基本フック
 */
"use client"

import { useShallow } from "zustand/shallow"
import { internalStore } from "./internalStore"

/** Store の状態を取得 */
export function useBackgroundStore() {
  return internalStore(
    useShallow((state) => ({
      backgrounds: state.backgrounds,
      currentKey: state.currentKey,
    }))
  )
}

/** Store のアクションを取得 */
export function useBackgroundStoreActions() {
  return internalStore(
    useShallow((state) => ({
      initialize: state.initialize,
      setBackground: state.setBackground,
      reset: state.reset,
    }))
  )
}
