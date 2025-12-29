/**
 * Background - 背景スプライト
 *
 * Store から背景パスを取得して表示する PixiJS コンポーネント
 * - Cover 方式で画面全体をカバー
 * - 中央配置
 * - フィルターはオプション（デフォルトなし）
 */
"use client"

import { useMemo, useState, useEffect } from "react"
import { extend } from "@pixi/react"
import { Sprite, BlurFilter, ColorMatrixFilter, Assets, Texture } from "pixi.js"
import { useGameSize } from "@/engine/components/Screen"
import { useBackground } from "../hooks"
import { defaultBlurQuality } from "../defaults"
import type { BackgroundFilters } from "../types"

extend({ Sprite })

type Props = {
  /** フィルター設定（オプション） */
  filters?: BackgroundFilters
  /** zIndex */
  zIndex?: number
}

export function Background({ filters: filterConfig, zIndex }: Props) {
  const { currentPath } = useBackground()
  const { width: screenWidth, height: screenHeight } = useGameSize()
  const [texture, setTexture] = useState<Texture | null>(null)

  // 背景画像をロード（完全パスを使用）
  useEffect(() => {
    if (!currentPath) {
      setTexture(null)
      return
    }

    let mounted = true
    const loadTexture = async () => {
      try {
        const tex = await Assets.load(currentPath)
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

  // フィルターをメモ化（指定された場合のみ作成）
  const pixiFilters = useMemo(() => {
    if (!filterConfig) return undefined

    const filters = []

    // ぼかしフィルター
    if (filterConfig.blur !== undefined && filterConfig.blur > 0) {
      filters.push(
        new BlurFilter({
          strength: filterConfig.blur,
          quality: filterConfig.blurQuality ?? defaultBlurQuality,
        })
      )
    }

    // 明るさフィルター
    if (filterConfig.brightness !== undefined) {
      const colorMatrix = new ColorMatrixFilter()
      colorMatrix.brightness(filterConfig.brightness, false)
      filters.push(colorMatrix)
    }

    return filters.length > 0 ? filters : undefined
  }, [filterConfig])

  // テクスチャがロードされるまで表示しない
  if (!texture || screenWidth <= 0 || screenHeight <= 0) {
    return null
  }

  // Cover 方式でサイズ計算
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
      filters={pixiFilters}
      zIndex={zIndex}
    />
  )
}
