/**
 * useBackground - Background 状態読み取りフック
 */
"use client"

import { useBackgroundStore } from "../stores"

/**
 * 現在の背景情報を取得
 */
export function useBackground() {
  const { backgrounds, currentKey } = useBackgroundStore()

  return {
    /** 現在の背景キー */
    currentKey,
    /** 現在の背景パス（完全パス） */
    currentPath: currentKey ? backgrounds[currentKey] ?? null : null,
    /** 背景バリエーション */
    backgrounds,
  }
}
