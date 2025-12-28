// src/app/lab/001-basic-scene/components/CharacterSprite/index.tsx

"use client"

import { useEffect, useRef, useState } from "react"
import { mergeStyles } from "@/engine/utils/styleUtils"
import { defaultCharacterSpriteStyle } from "./defaults"
import type { CharacterSpriteProps } from "./types"

/**
 * CharacterSprite - キャラクター立ち絵スプライト
 *
 * @pixi/react 用のコンポーネント
 * - 左右配置対応
 * - アクティブ/非アクティブの透明度アニメーション
 * - 画面サイズに応じた相対レイアウト
 */
export default function CharacterSprite({
  texture,
  side,
  isActive,
  screenWidth,
  screenHeight,
  style: styleOverrides,
}: CharacterSpriteProps) {
  const style = mergeStyles(defaultCharacterSpriteStyle, styleOverrides)
  const [alpha, setAlpha] = useState(style.alpha.active)
  const animationRef = useRef<number | null>(null)

  // アルファ値のアニメーション
  useEffect(() => {
    const targetAlpha = isActive ? style.alpha.active : style.alpha.inactive
    const startAlpha = alpha
    const startTime = performance.now()
    const duration = style.alpha.transitionDuration

    // 既存のアニメーションをキャンセル
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      // イージング（ease-out）
      const eased = 1 - Math.pow(1 - progress, 3)
      const newAlpha = startAlpha + (targetAlpha - startAlpha) * eased
      setAlpha(newAlpha)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, style.alpha.active, style.alpha.inactive, style.alpha.transitionDuration])

  // レイアウト計算
  const characterWidth = screenWidth * (style.layout.widthPercent / 100)
  const overflow = characterWidth * style.layout.horizontalOverflow
  const scale = characterWidth / texture.width

  // 位置計算
  const x = side === "left" ? -overflow : screenWidth + overflow
  const y = screenHeight - (screenHeight * style.layout.verticalPullUp)
  const anchor = side === "left" ? { x: 0, y: 0 } : { x: 1, y: 0 }

  return (
    <pixiSprite
      texture={texture}
      x={x}
      y={y}
      scale={scale}
      anchor={anchor}
      alpha={alpha}
    />
  )
}
