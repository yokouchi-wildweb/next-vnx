/**
 * SceneComposer
 *
 * arrangement に従って Feature の Sprite/Layer を画面に配置する
 * - sprites: PixiCanvas 内に zIndex 順で配置
 * - layers: DOM 上に Layer コンポーネントで配置
 *   - FeatureLayer: Feature 提供の Layer をそのまま配置
 *   - CustomLayer: Widget をグループ化して配置
 */
"use client"

import { useMemo } from "react"
import { extend } from "@pixi/react"
import { Container } from "pixi.js"
import type {
  Arrangement,
  SpriteItem,
  LayerItem,
  WidgetItem,
  FeatureBundle,
} from "@/engine/types"
import { PixiCanvas } from "@/engine/components/Screen"
import { Layer } from "@/engine/components/Layer"

// PixiJS コンポーネントを登録
extend({ Container })

type Props = {
  /** 配置設定 */
  arrangement: Arrangement
  /** Feature Map */
  featureMap: Map<string, FeatureBundle>
}

/**
 * SpriteItem を zIndex でソート
 */
function sortSpritesByZIndex(items: SpriteItem[]): SpriteItem[] {
  return [...items].sort((a, b) => a.zIndex - b.zIndex)
}

/**
 * LayerItem を zIndex でソート
 */
function sortLayersByZIndex(items: LayerItem[]): LayerItem[] {
  return [...items].sort((a, b) => a.zIndex - b.zIndex)
}

/**
 * WidgetItem を zIndex でソート
 */
function sortWidgetsByZIndex(items: WidgetItem[]): WidgetItem[] {
  return [...items].sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0))
}

/**
 * SceneComposer コンポーネント
 */
export function SceneComposer({ arrangement, featureMap }: Props) {
  // sprites を zIndex 順にソート
  const sortedSprites = useMemo(
    () => sortSpritesByZIndex(arrangement.sprites ?? []),
    [arrangement.sprites]
  )

  // layers を zIndex 順にソート
  const sortedLayers = useMemo(
    () => sortLayersByZIndex(arrangement.layers ?? []),
    [arrangement.layers]
  )

  /**
   * Layer をレンダリング
   */
  const renderLayer = (item: LayerItem, index: number) => {
    if (item.type === "featureLayer") {
      // Feature 提供の Layer
      const feature = featureMap.get(item.feature)
      const LayerComponent = feature?.Layers?.[item.component]

      if (!LayerComponent) {
        console.warn(
          `Layer not found: ${item.feature}.Layers.${item.component}`
        )
        return null
      }

      return (
        <Layer
          key={`layer-${item.feature}-${item.component}-${index}`}
          zIndex={item.zIndex}
        >
          <LayerComponent />
        </Layer>
      )
    } else {
      // CustomLayer: Widget をグループ化
      const sortedWidgets = sortWidgetsByZIndex(item.widgets)

      return (
        <Layer
          key={`customLayer-${index}`}
          zIndex={item.zIndex}
        >
          {sortedWidgets.map((widgetItem, widgetIndex) => {
            const feature = featureMap.get(widgetItem.feature)
            const WidgetComponent = feature?.Widgets?.[widgetItem.component]

            if (!WidgetComponent) {
              console.warn(
                `Widget not found: ${widgetItem.feature}.Widgets.${widgetItem.component}`
              )
              return null
            }

            return (
              <div
                key={`widget-${widgetItem.feature}-${widgetItem.component}-${widgetIndex}`}
                className="absolute inset-0 pointer-events-none"
                style={{ zIndex: widgetItem.zIndex ?? 0 }}
              >
                <WidgetComponent />
              </div>
            )
          })}
        </Layer>
      )
    }
  }

  return (
    <>
      {/* PixiJS Sprites（zIndex: 0 で最背面に配置） */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <PixiCanvas>
          <pixiContainer sortableChildren>
            {sortedSprites.map((item, index) => {
              const feature = featureMap.get(item.feature)
              const SpriteComponent = feature?.Sprites?.[item.component]

              if (!SpriteComponent) {
                console.warn(
                  `Sprite not found: ${item.feature}.Sprites.${item.component}`
                )
                return null
              }

              return (
                <SpriteComponent
                  key={`sprite-${item.feature}-${item.component}-${index}`}
                  zIndex={item.zIndex}
                />
              )
            })}
          </pixiContainer>
        </PixiCanvas>
      </div>

      {/* HTML Layers */}
      {sortedLayers.map(renderLayer)}
    </>
  )
}
