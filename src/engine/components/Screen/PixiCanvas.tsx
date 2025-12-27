/**
 * PixiCanvas
 *
 * PixiJS Application の汎用ラッパーコンポーネント
 * - useGameSize() でサイズ自動取得
 * - リサイズ時の自動対応
 * - resolution / devicePixelRatio 対応
 */
"use client"

import { useEffect } from "react"
import { Application, useApplication } from "@pixi/react"
import { cn } from "@/lib/cn"
import { useGameSize } from "./useGameScreen"

// ============================================================
// 型定義
// ============================================================

type PixiCanvasProps = {
  children: React.ReactNode
  /**
   * 背景色（CSS形式 "#000000"）
   * @default "#000000"
   */
  backgroundColor?: string
  /**
   * Application準備完了時のコールバック
   */
  onReady?: () => void
  /**
   * 追加のクラス名
   */
  className?: string
}

// ============================================================
// 内部コンポーネント: 自動リサイズ + readyコールバック
// ============================================================

type PixiCanvasInnerProps = {
  children: React.ReactNode
  onReady?: () => void
}

/**
 * Application内部で動作するコンポーネント
 * - ゲームサイズ変更時にrendererをリサイズ
 * - 準備完了時にonReadyを呼び出し
 */
function PixiCanvasInner({ children, onReady }: PixiCanvasInnerProps) {
  const { app } = useApplication()
  const { width, height } = useGameSize()

  // ゲームサイズ変更時にrendererをリサイズ
  useEffect(() => {
    if (width > 0 && height > 0 && app.renderer) {
      app.renderer.resize(width, height)
    }
  }, [app, width, height])

  // 準備完了通知（マウント時に一度だけ）
  useEffect(() => {
    onReady?.()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>
}

// ============================================================
// メインコンポーネント
// ============================================================

/**
 * PixiJS Application の汎用ラッパー
 *
 * @example
 * ```tsx
 * <PixiCanvas backgroundColor="#1a1a2e" onReady={handleReady}>
 *   <SceneContainer />
 * </PixiCanvas>
 * ```
 */
export default function PixiCanvas({
  children,
  backgroundColor = "#000000",
  onReady,
  className,
}: PixiCanvasProps) {
  const { width, height } = useGameSize()

  // サイズが確定するまで描画しない
  if (width <= 0 || height <= 0) {
    return null
  }

  return (
    <div className={cn("absolute inset-0", className)}>
      <Application
        width={width}
        height={height}
        backgroundColor={backgroundColor}
        resolution={typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1}
        autoDensity
      >
        <PixiCanvasInner onReady={onReady}>
          {children}
        </PixiCanvasInner>
      </Application>
    </div>
  )
}
