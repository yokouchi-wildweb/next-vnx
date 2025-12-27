/**
 * GameScreen
 *
 * ゲーム画面全体を管理する統合コンポーネント
 * - FullScreenでビューポート制御
 * - Contextでサイズ情報を提供
 * - Letterbox + GameContainerのレイアウト
 */
"use client"

import { useMemo } from "react"
import FullScreen, { type FullScreenLayer } from "@/components/Layout/FullScreen"
import { useViewportSizeStore } from "@/stores/viewportSize"
import {
  GameScreenContext,
  calculateGameSize,
  DEFAULT_DISPLAY_CONFIG,
  type DisplayConfig,
  type GameScreenContextValue,
} from "./GameScreenContext"
import Letterbox from "./Letterbox"
import GameContainer from "./GameContainer"

type Props = {
  children: React.ReactNode
  /**
   * display設定（scenario.jsonから読み込んだ値）
   * 未指定の場合はデフォルト（16:9）
   */
  displayConfig?: Partial<DisplayConfig>
  /**
   * FullScreenのレイヤー
   */
  layer?: FullScreenLayer
  /**
   * 追加のクラス名
   */
  className?: string
}

/**
 * ゲーム画面の統合コンポーネント
 *
 * @example
 * ```tsx
 * <GameScreen displayConfig={scenario.display}>
 *   <PixiApplication>...</PixiApplication>
 *   <UIOverlay>...</UIOverlay>
 * </GameScreen>
 * ```
 */
export default function GameScreen({
  children,
  displayConfig: displayConfigProp,
  layer = "base",
  className,
}: Props) {
  const { width: viewportWidth, height: viewportHeight } = useViewportSizeStore()

  // display設定をマージ
  const displayConfig: DisplayConfig = useMemo(() => ({
    ...DEFAULT_DISPLAY_CONFIG,
    ...displayConfigProp,
    letterbox: {
      ...DEFAULT_DISPLAY_CONFIG.letterbox,
      ...displayConfigProp?.letterbox,
    },
  }), [displayConfigProp])

  // ゲームサイズを計算
  const gameSize = useMemo(() =>
    calculateGameSize(displayConfig, viewportWidth, viewportHeight),
    [displayConfig, viewportWidth, viewportHeight]
  )

  // Context値
  const contextValue: GameScreenContextValue = useMemo(() => ({
    gameSize,
    viewportSize: { width: viewportWidth, height: viewportHeight },
    displayConfig,
  }), [gameSize, viewportWidth, viewportHeight, displayConfig])

  return (
    <FullScreen layer={layer} className={className}>
      <GameScreenContext.Provider value={contextValue}>
        <div className="relative w-full h-full">
          {/* レターボックス背景 */}
          <Letterbox />

          {/* ゲームコンテナ */}
          <GameContainer>
            {children}
          </GameContainer>
        </div>
      </GameScreenContext.Provider>
    </FullScreen>
  )
}
