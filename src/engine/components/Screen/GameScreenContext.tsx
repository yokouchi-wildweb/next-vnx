/**
 * GameScreenContext
 *
 * ゲーム画面のサイズ情報を提供するContext
 * シナリオごとのアスペクト比設定に基づいて計算されたサイズを共有
 */
"use client"

import { createContext, useMemo } from "react"

// ============================================================
// 型定義
// ============================================================

/**
 * シナリオのdisplay設定（scenario.jsonから読み込む）
 */
export type DisplayConfig = {
  aspectRatio: { width: number; height: number }
  padding?: {
    top?: number | string
    bottom?: number | string
    left?: number | string
    right?: number | string
  } | number | string
  letterbox?: {
    color?: string
    image?: string
  }
}

/**
 * 計算されたゲームサイズ
 */
export type GameSize = {
  width: number
  height: number
  scale: number
}

/**
 * GameScreenContextの値
 */
export type GameScreenContextValue = {
  /** 計算されたゲームサイズ */
  gameSize: GameSize
  /** ビューポートサイズ */
  viewportSize: { width: number; height: number }
  /** display設定 */
  displayConfig: DisplayConfig
}

// ============================================================
// Context
// ============================================================

export const GameScreenContext = createContext<GameScreenContextValue | null>(null)

// ============================================================
// ユーティリティ
// ============================================================

/**
 * padding値をピクセルに変換
 */
function parsePaddingValue(
  value: number | string | undefined,
  referenceSize: number
): number {
  if (value === undefined) return 0
  if (typeof value === "number") return value
  if (value.endsWith("%")) {
    return (parseFloat(value) / 100) * referenceSize
  }
  return parseFloat(value) || 0
}

/**
 * padding設定をパースして各方向の値を取得
 */
export function parsePadding(
  padding: DisplayConfig["padding"],
  viewportWidth: number,
  viewportHeight: number
): { top: number; bottom: number; left: number; right: number } {
  if (padding === undefined) {
    return { top: 0, bottom: 0, left: 0, right: 0 }
  }

  if (typeof padding === "number" || typeof padding === "string") {
    const value = typeof padding === "number"
      ? padding
      : parsePaddingValue(padding, Math.min(viewportWidth, viewportHeight))
    return { top: value, bottom: value, left: value, right: value }
  }

  return {
    top: parsePaddingValue(padding.top, viewportHeight),
    bottom: parsePaddingValue(padding.bottom, viewportHeight),
    left: parsePaddingValue(padding.left, viewportWidth),
    right: parsePaddingValue(padding.right, viewportWidth),
  }
}

/**
 * アスペクト比とビューポートサイズからゲームサイズを計算
 */
export function calculateGameSize(
  displayConfig: DisplayConfig,
  viewportWidth: number,
  viewportHeight: number
): GameSize {
  if (viewportWidth <= 0 || viewportHeight <= 0) {
    return { width: 0, height: 0, scale: 1 }
  }

  const { aspectRatio } = displayConfig
  const targetAspect = aspectRatio.width / aspectRatio.height

  // padding を適用した有効領域を計算
  const padding = parsePadding(displayConfig.padding, viewportWidth, viewportHeight)
  const availableWidth = viewportWidth - padding.left - padding.right
  const availableHeight = viewportHeight - padding.top - padding.bottom

  if (availableWidth <= 0 || availableHeight <= 0) {
    return { width: 0, height: 0, scale: 1 }
  }

  const availableAspect = availableWidth / availableHeight

  let width: number
  let height: number

  if (availableAspect > targetAspect) {
    // 有効領域の方が横長 → 高さ基準でフィット
    height = availableHeight
    width = height * targetAspect
  } else {
    // 有効領域の方が縦長 → 幅基準でフィット
    width = availableWidth
    height = width / targetAspect
  }

  // スケールは基準幅（例: 1920）に対する比率
  // ここでは単純にアスペクト比のwidth値を基準とする
  const baseWidth = aspectRatio.width * 100 // 16 * 100 = 1600 を仮の基準に
  const scale = width / baseWidth

  return { width, height, scale }
}

// ============================================================
// デフォルト値
// ============================================================

export const DEFAULT_DISPLAY_CONFIG: DisplayConfig = {
  aspectRatio: { width: 16, height: 9 },
  letterbox: { color: "#000000" },
}
