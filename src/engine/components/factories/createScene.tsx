/**
 * createScene
 *
 * Scene生成ファクトリ
 * - relative + inset-0 で Widget 配置領域を保証
 * - 全シーンに共通の機能を一括で追加できる拡張ポイント
 *
 * 契約: Scene は GameContainer 内で使用される
 */

"use client"

import type { CSSProperties, ReactNode } from "react"

/** createScene に渡す設定 */
type SceneOptions = {
  name: string
  // 将来の拡張用
  // transition?: "fade" | "slide" | "none"
  // preload?: string[]
}

/** createScene が返すコンポーネントの型 */
type SceneResult = React.FC<{ children?: ReactNode }> & {
  displayName: string
  sceneName: string
}

/** Scene コンテナのスタイル */
const sceneContainerStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
}

/**
 * シーンコンポーネントを生成する
 *
 * @example
 * ```tsx
 * const NovelScene = createScene({
 *   name: "NovelScene",
 * }, () => (
 *   <>
 *     <PixiCanvas>
 *       <BgSwitcherSprite {...} />
 *       <CharacterSprite {...} />
 *     </PixiCanvas>
 *     <DialogueMessage />
 *   </>
 * ))
 * ```
 */
export function createScene(
  options: SceneOptions,
  render: () => ReactNode
): SceneResult {
  function Scene() {
    return (
      <div style={sceneContainerStyle} data-scene={options.name}>
        {render()}
      </div>
    )
  }

  Scene.displayName = `${options.name}Scene`
  Scene.sceneName = options.name

  return Scene as SceneResult
}
