/**
 * GameOrchestrator
 *
 * ゲーム全体を統括する最上位コンポーネント
 * - モード管理（title / loading / playing / paused）
 * - セーブ/ロード（SaveManager 連携）
 * - ゲーム開始（ニューゲーム / ロード再開）
 */
"use client"

import type { ReactNode } from "react"

type Props = {
  children: ReactNode
}

/**
 * GameOrchestrator コンポーネント
 *
 * 現在はスケルトン。子コンポーネントをそのままレンダリング。
 * 将来的には:
 * - SaveManager の初期化
 * - GlobalState の提供
 * - モードに応じた画面切り替え
 */
export function GameOrchestrator({ children }: Props) {
  // TODO: SaveManager 初期化
  // TODO: GlobalState プロバイダー

  return <>{children}</>
}
