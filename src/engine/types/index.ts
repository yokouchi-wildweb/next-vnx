/**
 * VNX Engine 型定義
 */

// ============================================================
// シーン
// ============================================================

/** シーンデータ（汎用） */
export type Scene = {
  id: string
  type: string
  [key: string]: unknown
}

// ============================================================
// Archetype（シーンタイプ設定）
// ============================================================

/** 配置アイテム */
export type ArrangementItem = {
  feature: string
  component: string
  zIndex: number
  style?: Record<string, string | number>
}

/** 配置設定 */
export type Arrangement = {
  sprites?: ArrangementItem[]
  layers?: ArrangementItem[]
  widgets?: ArrangementItem[]
}

/** シーンタイプ定義（Archetype） */
export type SceneTypeDefinition = {
  /** 使用する Feature */
  features: string[]
  /** デフォルトの配置設定 */
  arrangement: Arrangement
}

// ============================================================
// Feature Bundle
// ============================================================

/** コマンドハンドラー */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CommandHandler = (data: any) => void

/** コマンド定義 */
export type FeatureCommands = Record<string, CommandHandler>

/** Feature Bundle */
export type FeatureBundle = {
  /** Feature 識別子（Single Source of Truth） */
  name: string
  /** コマンドハンドラー */
  commands: FeatureCommands
  /** PixiJS コンポーネント */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Sprites?: Record<string, React.ComponentType<any>>
  /** HTML コンポーネント（単体） */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Widgets?: Record<string, React.ComponentType<any>>
  /** HTML コンポーネント（グループ） */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Layers?: Record<string, React.ComponentType<any>>
  /** 状態フック */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hooks?: Record<string, any>
}
