/**
 * useGameScreen
 *
 * GameScreenContextからゲーム画面情報を取得するhook
 */
"use client"

import { useContext } from "react"
import { GameScreenContext, type GameScreenContextValue, type GameSize } from "./GameScreenContext"

/**
 * ゲーム画面のサイズ情報を取得
 * GameScreen コンポーネント内でのみ使用可能
 */
export function useGameScreen(): GameScreenContextValue {
  const context = useContext(GameScreenContext)

  if (!context) {
    throw new Error("useGameScreen must be used within a GameScreen component")
  }

  return context
}

/**
 * ゲームサイズのみを取得（シンプルなアクセス用）
 */
export function useGameSize(): GameSize {
  const { gameSize } = useGameScreen()
  return gameSize
}
