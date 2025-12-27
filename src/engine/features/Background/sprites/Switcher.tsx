/**
 * Switcher - 背景切り替えスプライト
 *
 * 純粋な PixiJS コンポーネント（@pixi/react用）
 * - ぼかし + 暗めフィルター適用
 * - Cover方式で画面全体をカバー
 * - 中央配置
 */

"use client"

import { useMemo } from "react"
import { BlurFilter, ColorMatrixFilter } from "pixi.js"
import { mergeStyles } from "@/engine/utils/styleUtils"
import { defaultSwitcherStyle } from "../defaults"
import type { SwitcherProps } from "../types"

export function Switcher({
  texture,
  screenWidth,
  screenHeight,
  style: styleOverrides,
}: SwitcherProps) {
  const style = mergeStyles(defaultSwitcherStyle, styleOverrides)

  // フィルターをメモ化
  const filters = useMemo(() => {
    const blurFilter = new BlurFilter({
      strength: style.blur.strength,
      quality: style.blur.quality,
    })
    const colorMatrix = new ColorMatrixFilter()
    colorMatrix.brightness(style.brightness.value, false)
    return [blurFilter, colorMatrix]
  }, [style.blur.strength, style.blur.quality, style.brightness.value])

  // Cover方式でサイズ計算
  const bgAspect = texture.width / texture.height
  const screenAspect = screenWidth / screenHeight

  let width: number, height: number
  if (screenAspect > bgAspect) {
    // 画面が横長: 幅に合わせる
    width = screenWidth
    height = screenWidth / bgAspect
  } else {
    // 画面が縦長: 高さに合わせる
    height = screenHeight
    width = screenHeight * bgAspect
  }

  // 中央配置
  const x = (screenWidth - width) / 2
  const y = (screenHeight - height) / 2

  return (
    <pixiSprite
      texture={texture}
      x={x}
      y={y}
      width={width}
      height={height}
      filters={filters}
    />
  )
}
