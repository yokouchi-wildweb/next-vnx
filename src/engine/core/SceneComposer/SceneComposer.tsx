/**
 * SceneComposer
 *
 * デフォルトの Composer
 * arrangement に従って Feature の Widget/Sprite を画面に配置する
 */
"use client"

import type { ReactNode } from "react"

type Props = {
  /** 配置設定 */
  arrangement?: Record<string, unknown>
  children?: ReactNode
}

/**
 * SceneComposer コンポーネント
 *
 * TODO:
 * - arrangement を解析
 * - 指定された Feature の Widget/Sprite を配置
 * - zIndex に従ってレイヤリング
 */
export function SceneComposer({ arrangement, children }: Props) {
  // TODO: 実装
  return <>{children}</>
}
