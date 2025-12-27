/**
 * Standing - 立ち絵スプライト
 *
 * 純粋な PixiJS コンポーネント（@pixi/react用）
 * - シンプルな立ち絵表示
 * - 位置、スケール、アンカー、透明度のみ
 * - エフェクト（フィルターなど）は上位層の責務
 */

"use client"

import { useGameSize } from "@/engine/components/Screen"
import { defaultStandingAnchor } from "../defaults"
import type { StandingProps } from "../types"

export function Standing({
  texture,
  position,
  scale = 1,
  anchor = defaultStandingAnchor,
  opacity = 1,
}: StandingProps) {
  const { width: screenWidth, height: screenHeight } = useGameSize()

  // 相対座標をピクセルに変換
  const x = position.x * screenWidth
  const y = position.y * screenHeight

  return (
    <pixiSprite
      texture={texture}
      x={x}
      y={y}
      scale={scale}
      anchor={anchor}
      alpha={opacity}
    />
  )
}
