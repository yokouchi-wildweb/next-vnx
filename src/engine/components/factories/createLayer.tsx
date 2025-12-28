/**
 * createLayer
 *
 * Layer生成ファクトリ
 * - Widget グループ化用のコンテナ
 * - absolute + inset: 0 で親にフィット
 * - z-index でレイヤー順序を管理
 * - Feature から提供される推奨レイアウト
 */

"use client"

import type { CSSProperties, ReactNode } from "react"

/** createLayer に渡す設定 */
type LayerOptions = {
  name: string
  zIndex: number
}

/** createLayer が返すコンポーネントの型 */
type LayerResult = React.FC<{ zIndex?: number; visible?: boolean }> & {
  displayName: string
  defaultZIndex: number
}

/** Layer コンテナのスタイル */
const layerContainerStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
}

/**
 * Widget グループをまとめた Layer を生成する
 *
 * @example
 * ```tsx
 * export const DialogueLayer = createLayer({
 *   name: "DialogueLayer",
 *   zIndex: 10,
 * }, () => (
 *   <>
 *     <DialogueMessage />
 *     <SpeakerName />
 *   </>
 * ))
 * ```
 */
export function createLayer(
  options: LayerOptions,
  render: () => ReactNode
): LayerResult {
  function Layer({ zIndex = options.zIndex, visible = true }: { zIndex?: number; visible?: boolean }) {
    if (!visible) return null

    return (
      <div
        style={{ ...layerContainerStyle, zIndex }}
        data-layer={options.name}
      >
        {render()}
      </div>
    )
  }

  Layer.displayName = `${options.name}Layer`
  Layer.defaultZIndex = options.zIndex

  return Layer as LayerResult
}
