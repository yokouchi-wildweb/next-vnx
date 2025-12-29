/**
 * VNX Engine 型定義
 *
 * すべての型定義はここに集約する
 */

// ============================================================
// 基本型
// ============================================================

/** シーンタイプ */
export type SceneType = "dialogue" | "battle" | "exploration"

/** ポジション */
export type Position = "left" | "center" | "right" | number

// ============================================================
// ノード（最小実行単位）
// ============================================================

/** ダイアログノード */
export type DialogueNode = {
  type: "dialogue"
  speaker: string
  text: string
  sprite?: string
  commands?: Command[]
}

/** 選択肢ノード */
export type ChoiceNode = {
  type: "choice"
  options: ChoiceOption[]
}

export type ChoiceOption = {
  text: string
  next: string
  setFlags?: Record<string, unknown>
}

/** エフェクトノード */
export type EffectNode = {
  type: "effect"
  name: string
  params?: Record<string, unknown>
}

/** ノード（Union） */
export type Node = DialogueNode | ChoiceNode | EffectNode

// ============================================================
// コマンド
// ============================================================

export type BgmCommand = {
  type: "bgm"
  assetId: string
  volume?: number
  fadeIn?: number
}

export type BgmStopCommand = {
  type: "bgm_stop"
  fadeOut?: number
}

export type SeCommand = {
  type: "se"
  assetId: string
  volume?: number
}

export type BackgroundCommand = {
  type: "background"
  value: string
  transition?: "fade" | "slide" | "none"
  duration?: number
}

export type CharacterCommand = {
  type: "character"
  id: string
  action: "show" | "hide" | "move"
  position?: Position
  sprite?: string
}

export type Command =
  | BgmCommand
  | BgmStopCommand
  | SeCommand
  | BackgroundCommand
  | CharacterCommand

// ============================================================
// フラグメント
// ============================================================

/** フラグメント定義 */
export type Fragment = {
  nodes: Node[]
  next?: string
  sceneEnd?: boolean
}

// ============================================================
// キャラクター
// ============================================================

/** シーン内キャラクター設定 */
export type SceneCharacter = {
  position: Position
  sprite?: string
  scale?: number
  layer?: number
}

// ============================================================
// シーン（共通）
// ============================================================

/** シーン定義（基本） */
export type SceneBase = {
  id: string
  type: SceneType
  chapterId?: string

  /** 背景バリエーション */
  backgrounds?: Record<string, string>
  /** 初期背景 */
  initialBackground?: string

  /** 登場キャラクター */
  characters?: Record<string, SceneCharacter>

  /** 初期BGM */
  initialBgm?: {
    assetId: string
    volume?: number
  }
}

// ============================================================
// ダイアログシーン
// ============================================================

/** ダイアログシーン定義 */
export type DialogueScene = SceneBase & {
  type: "dialogue"

  /** フラグメント定義 */
  fragments: Record<string, Fragment>

  /** 開始フラグメント */
  initialFragment: string
}

// ============================================================
// シーン（Union）
// ============================================================

export type Scene = DialogueScene // | BattleScene | ExplorationScene（将来追加）

// ============================================================
// シナリオ
// ============================================================

/** キャラクター定義 */
export type CharacterDef = {
  name: string
  color: string
  sprites: Record<string, string>
}

/** シナリオ定義 */
export type Scenario = {
  id: string
  title: string
  description?: string
  characters: Record<string, CharacterDef>
  display?: {
    aspectRatio?: string
    letterboxColor?: string
  }
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
