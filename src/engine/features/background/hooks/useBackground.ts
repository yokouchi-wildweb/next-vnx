/**
 * useBackground - Background 状態読み取りフック
 */
"use client"

import { useBackgroundStore } from "../stores"

/**
 * 現在の背景情報を取得
 */
export function useBackground() {
  const { backgrounds, currentBackground } = useBackgroundStore()

  return {
    /** 現在の背景キー */
    currentBackground,
    /** 現在の背景パス */
    currentPath: currentBackground ? backgrounds[currentBackground] : null,
    /** 背景バリエーション */
    backgrounds,
  }
}
