/**
 * Switcher - 背景切り替えスプライト
 *
 * store から背景情報を取得して表示する PixiJS コンポーネント
 * - ぼかし + 暗めフィルター適用
 * - Cover方式で画面全体をカバー
 * - 中央配置
 */

"use client"

import { useMemo, useState, useEffect } from "react"
import { extend } from "@pixi/react"
import { Sprite, BlurFilter, ColorMatrixFilter, Assets, Texture } from "pixi.js"
import { useGameSize } from "@/engine/components/Screen"
import { mergeStyles } from "@/engine/utils/styleUtils"
import { defaultSwitcherStyle } from "../defaults"
import { useBackground } from "../hooks"
import type { SwitcherStyle } from "../types"

// PixiJS コンポーネントを登録
extend({ Sprite })

type Props = {
  style?: Partial<SwitcherStyle>
  zIndex?: number
}

export function Switcher({ style: styleOverrides, zIndex }: Props) {
  const { currentPath } = useBackground()
  const { width: screenWidth, height: screenHeight } = useGameSize()
  const [texture, setTexture] = useState<Texture | null>(null)

  const style = mergeStyles(defaultSwitcherStyle, styleOverrides)

  // 背景画像をロード
  useEffect(() => {
    if (!currentPath) {
      setTexture(null)
      return
    }

    let mounted = true
    const loadTexture = async () => {
      try {
        // パスからテクスチャをロード
        // TODO: シナリオIDをContextから取得する
        const tex = await Assets.load(`/game/scenarios/_sample/backgrounds/${currentPath}.png`)
        if (mounted) {
          setTexture(tex)
        }
      } catch (err) {
        console.warn(`Failed to load background: ${currentPath}`, err)
      }
    }

    loadTexture()
    return () => {
      mounted = false
    }
  }, [currentPath])

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

  // テクスチャがロードされるまで表示しない
  if (!texture || screenWidth <= 0 || screenHeight <= 0) {
    return null
  }

  // Cover方式でサイズ計算
  const bgAspect = texture.width / texture.height
  const screenAspect = screenWidth / screenHeight

  let width: number, height: number
  if (screenAspect > bgAspect) {
    width = screenWidth
    height = screenWidth / bgAspect
  } else {
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
      zIndex={zIndex}
    />
  )
}
