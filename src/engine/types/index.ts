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
// Arrangement（配置設定）
// ============================================================

/** Sprite 配置アイテム */
export type SpriteItem = {
  type: "sprite"
  feature: string
  component: string
  zIndex: number
}

/** Widget 配置アイテム（Layer 内で使用） */
export type WidgetItem = {
  type: "widget"
  feature: string
  component: string
  zIndex?: number
}

/** Feature 提供の Layer */
export type FeatureLayerItem = {
  type: "featureLayer"
  feature: string
  component: string
  zIndex: number
}

/** カスタム Layer（Widget をグループ化） */
export type CustomLayerItem = {
  type: "customLayer"
  zIndex: number
  widgets: WidgetItem[]
}

/** Layer アイテム（Feature Layer または CustomLayer） */
export type LayerItem = FeatureLayerItem | CustomLayerItem

/** 配置設定 */
export type Arrangement = {
  sprites?: SpriteItem[]
  layers?: LayerItem[]
}

// ============================================================
// Archetype（シーンタイプ設定）
// ============================================================

/** シーンタイプ定義（Archetype） */
export type SceneTypeDefinition = {
  /** 使用する Feature */
  features: FeatureBundle[]
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
  /** HTML コンポーネント（単体、Layer 内で使用） */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Widgets?: Record<string, React.ComponentType<any>>
  /** HTML コンポーネント（グループ、直接配置） */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Layers?: Record<string, React.ComponentType<any>>
  /** 状態フック */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hooks?: Record<string, any>
}
