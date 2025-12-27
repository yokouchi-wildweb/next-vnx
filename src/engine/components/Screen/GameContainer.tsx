/**
 * GameContainer
 *
 * ゲームのメインコンテンツ領域
 * - 固定アスペクト比を維持
 * - センタリング + padding考慮
 * - <main>タグでセマンティクスを確保
 */
"use client"

import { cn } from "@/lib/cn"
import { useGameScreen } from "./useGameScreen"
import { parsePadding } from "./GameScreenContext"

type Props = {
  className?: string
  children: React.ReactNode
}

/**
 * ゲームのメインコンテンツ領域
 * GameScreen内で使用し、Contextからサイズ情報を取得
 */
export default function GameContainer({ className, children }: Props) {
  const { gameSize, viewportSize, displayConfig } = useGameScreen()

  if (gameSize.width <= 0 || gameSize.height <= 0) {
    return null
  }

  // padding を考慮した位置計算
  const padding = parsePadding(
    displayConfig.padding,
    viewportSize.width,
    viewportSize.height
  )

  // 有効領域内でのセンタリング
  const availableWidth = viewportSize.width - padding.left - padding.right
  const availableHeight = viewportSize.height - padding.top - padding.bottom

  const left = padding.left + (availableWidth - gameSize.width) / 2
  const top = padding.top + (availableHeight - gameSize.height) / 2

  return (
    <main
      className={cn("absolute", className)}
      style={{
        width: gameSize.width,
        height: gameSize.height,
        left,
        top,
      }}
    >
      {children}
    </main>
  )
}
