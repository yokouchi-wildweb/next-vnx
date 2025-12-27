/**
 * Letterbox
 *
 * レターボックス領域（ゲーム画面外の装飾領域）
 * - 背景色の設定
 * - 背景画像の設定（オプション）
 */
"use client"

import { useGameScreen } from "./useGameScreen"

/**
 * レターボックス背景
 * ビューポート全体を覆い、GameContainerの後ろに配置
 */
export default function Letterbox() {
  const { displayConfig } = useGameScreen()

  const letterbox = displayConfig.letterbox
  const backgroundColor = letterbox?.color ?? "#000000"
  const backgroundImage = letterbox?.image

  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundColor,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      aria-hidden="true"
    />
  )
}
