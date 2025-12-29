/**
 * Arrangement ヘルパー関数
 *
 * シーン定義で使用する型安全なヘルパー
 * - sprite(): Sprite を配置
 * - layer(): Feature 提供の Layer を配置
 * - customLayer(): Widget をグループ化して Layer を構成
 * - widget(): customLayer 内で Widget を配置
 */

import type {
  FeatureBundle,
  SpriteItem,
  WidgetItem,
  FeatureLayerItem,
  CustomLayerItem,
} from "@/engine/types"

/**
 * Sprite を配置
 *
 * @example
 * sprite(Background, "Background", 0)
 */
export function sprite<F extends FeatureBundle>(
  feature: F,
  component: keyof NonNullable<F["Sprites"]>,
  zIndex: number
): SpriteItem {
  return {
    type: "sprite",
    feature: feature.name,
    component: component as string,
    zIndex,
  }
}

/**
 * Feature 提供の Layer を配置
 *
 * @example
 * layer(Dialogue, "DialogueUI", 100)
 */
export function layer<F extends FeatureBundle>(
  feature: F,
  component: keyof NonNullable<F["Layers"]>,
  zIndex: number
): FeatureLayerItem {
  return {
    type: "featureLayer",
    feature: feature.name,
    component: component as string,
    zIndex,
  }
}

/**
 * Widget をグループ化して Layer を構成
 *
 * @example
 * customLayer(100, [
 *   widget(Dialogue, "MessageList"),
 *   widget(Character, "NameCard", 10),
 * ])
 */
export function customLayer(
  zIndex: number,
  widgets: WidgetItem[]
): CustomLayerItem {
  return {
    type: "customLayer",
    zIndex,
    widgets,
  }
}

/**
 * Widget を配置（customLayer 内で使用）
 *
 * @example
 * widget(Dialogue, "MessageList")
 * widget(Character, "NameCard", 10)  // Layer 内での相対 zIndex
 */
export function widget<F extends FeatureBundle>(
  feature: F,
  component: keyof NonNullable<F["Widgets"]>,
  zIndex?: number
): WidgetItem {
  return {
    type: "widget",
    feature: feature.name,
    component: component as string,
    zIndex,
  }
}
