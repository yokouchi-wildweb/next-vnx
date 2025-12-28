/**
 * GameContainer
 *
 * 固定アスペクト比のゲームコンテナ
 * ビューポートに収まるようにスケーリングし、センタリングする
 * はみ出る部分はレターボックス（黒帯）で対応
 */
"use client"

import { useEffect, useState, useMemo } from "react"
import { cn } from "@/lib/cn"

// ゲームのベース解像度（アスペクト比の基準）
const BASE_WIDTH = 1920
const BASE_HEIGHT = 1080
const ASPECT_RATIO = BASE_WIDTH / BASE_HEIGHT // 16:9

export type GameSize = {
  width: number
  height: number
  scale: number
}

type Props = {
  className?: string
  children: React.ReactNode
  /**
   * ビューポートサイズ（親から渡す）
   */
  viewportWidth: number
  viewportHeight: number
  /**
   * ゲームサイズが確定したときのコールバック
   */
  onSizeChange?: (size: GameSize) => void
}

/**
 * 固定アスペクト比（16:9）のゲームコンテナ
 * ビューポートに収まる最大サイズを計算し、センタリング
 */
export default function GameContainer({
  className,
  children,
  viewportWidth,
  viewportHeight,
  onSizeChange,
}: Props) {
  // ゲームサイズを計算
  const gameSize = useMemo(() => {
    if (viewportWidth <= 0 || viewportHeight <= 0) {
      return { width: 0, height: 0, scale: 1 }
    }

    const viewportAspect = viewportWidth / viewportHeight

    let width: number
    let height: number

    if (viewportAspect > ASPECT_RATIO) {
      // ビューポートの方が横長 → 高さ基準でフィット（左右に黒帯：ピラーボックス）
      height = viewportHeight
      width = height * ASPECT_RATIO
    } else {
      // ビューポートの方が縦長 → 幅基準でフィット（上下に黒帯：レターボックス）
      width = viewportWidth
      height = width / ASPECT_RATIO
    }

    const scale = width / BASE_WIDTH

    return { width, height, scale }
  }, [viewportWidth, viewportHeight])

  // サイズ変更をコールバック
  useEffect(() => {
    if (gameSize.width > 0 && gameSize.height > 0) {
      onSizeChange?.(gameSize)
    }
  }, [gameSize, onSizeChange])

  if (gameSize.width <= 0 || gameSize.height <= 0) {
    return null
  }

  return (
    <div
      className={cn(
        "absolute",
        className
      )}
      style={{
        width: gameSize.width,
        height: gameSize.height,
        left: (viewportWidth - gameSize.width) / 2,
        top: (viewportHeight - gameSize.height) / 2,
      }}
    >
      {children}
    </div>
  )
}

// 定数をエクスポート（他のコンポーネントで使用可能）
export { BASE_WIDTH, BASE_HEIGHT, ASPECT_RATIO }
