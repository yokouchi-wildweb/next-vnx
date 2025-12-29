/**
 * Standing - 立ち絵スプライト
 *
 * 純粋な props ベースのコンポーネント
 * - 指定された位置にスプライトを表示
 * - 画面幅に対する相対サイズで表示
 * - transform プロパティ（rotation, pivot, skew）対応
 * - Store なし、状態管理は利用側の責務
 */
"use client"

import { useState, useEffect } from "react"
import { extend } from "@pixi/react"
import { Sprite, Assets, Texture } from "pixi.js"
import { useGameSize } from "@/engine/components/Screen"
import {
  defaultAnchorX,
  defaultAnchorY,
  defaultRotation,
  defaultPivotX,
  defaultPivotY,
  defaultSkewX,
  defaultSkewY,
  defaultAlpha,
} from "../defaults"
import type { StandingProps } from "../types"

// PixiJS コンポーネントを登録
extend({ Sprite })

export function Standing({
  spritePath,
  x,
  y,
  widthPercent,
  anchorX = defaultAnchorX,
  anchorY = defaultAnchorY,
  rotation = defaultRotation,
  angle,
  pivotX = defaultPivotX,
  pivotY = defaultPivotY,
  skewX = defaultSkewX,
  skewY = defaultSkewY,
  alpha = defaultAlpha,
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

  // スケール計算: 画面幅の widthPercent% になるように
  const targetWidth = screenWidth * (widthPercent / 100)
  const scale = targetWidth / texture.width

  // 相対座標をピクセルに変換
  const pixelX = x * screenWidth
  const pixelY = y * screenHeight

  // 回転: angle が指定されていれば優先（度数 → ラジアン変換）
  const finalRotation = angle !== undefined ? (angle * Math.PI) / 180 : rotation

  return (
    <pixiSprite
      texture={texture}
      x={pixelX}
      y={pixelY}
      scale={scale}
      anchor={{ x: anchorX, y: anchorY }}
      rotation={finalRotation}
      pivot={{ x: pivotX, y: pivotY }}
      skew={{ x: skewX, y: skewY }}
      alpha={alpha}
      zIndex={zIndex}
    />
  )
}
