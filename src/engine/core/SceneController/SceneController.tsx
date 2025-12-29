/**
 * SceneController
 *
 * シーンの初期化と制御を担当
 */
"use client"

import type { ReactNode } from "react"

type Props = {
  /** シーンデータ（JSON から読み込んだデータ） */
  scene: Record<string, unknown>
  children?: ReactNode
}

/**
 * SceneController コンポーネント
 *
 * TODO:
 * - scene データを解析
 * - Feature Store に初期データをセット
 * - SceneComposer をレンダリング
 */
export function SceneController({ scene, children }: Props) {
  // TODO: 実装
  return <>{children}</>
}
