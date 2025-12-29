/**
 * Standing - 立ち絵スプライト
 *
 * 純粋な props ベースのコンポーネント
 * - 指定された位置にスプライトを表示
 * - Store なし、状態管理は利用側の責務
 */
"use client"

import { useState, useEffect } from "react"
import { extend } from "@pixi/react"
import { Sprite, Assets, Texture } from "pixi.js"
import { useGameSize } from "@/engine/components/Screen"
import { defaultAnchor, defaultScale, defaultAlpha } from "../defaults"
import type { StandingProps } from "../types"

// PixiJS コンポーネントを登録
extend({ Sprite })

export function Standing({
  spritePath,
  position,
  scale = defaultScale,
  alpha = defaultAlpha,
  anchor = defaultAnchor,
  zIndex,
}: StandingProps) {
  const { width: screenWidth, height: screenHeight } = useGameSize()
  const [texture, setTexture] = useState<Texture | null>(null)

  // スプライト画像をロード
  useEffect(() => {
    let mounted = true

    const loadTexture = async () => {
      try {
        const tex = await Assets.load(spritePath)
        if (mounted) {
          setTexture(tex)
        }
      } catch (err) {
        console.warn(`Failed to load character sprite: ${spritePath}`, err)
      }
    }

    loadTexture()
    return () => {
      mounted = false
    }
  }, [spritePath])

  // テクスチャがない、または画面サイズが0なら表示しない
  if (!texture || screenWidth <= 0 || screenHeight <= 0) {
    return null
  }

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
      alpha={alpha}
      zIndex={zIndex}
    />
  )
}
