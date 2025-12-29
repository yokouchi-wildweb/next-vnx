/**
 * Lab 001 用の型定義（旧 engine/types から移動）
 *
 * 注意: これは実験用の古い型定義です。
 * 正式なエンジンの型定義は engine/types/ を参照してください。
 */

// ============================================================
// シナリオ関連
// ============================================================

export type ScenarioType = "visual-novel" | "murder-mystery"

export type SpriteVariants = Record<string, string>

export interface CharacterDef {
  name: string
  color: string
  sprites: SpriteVariants
}

export type CharacterDefs = Record<string, CharacterDef>

export interface Scenario {
  id: string
  title: string
  type: ScenarioType
  description?: string
  display?: {
    aspectRatio?: string
    letterboxColor?: string
    minWidth?: number
    maxWidth?: number
  }
  characters: CharacterDefs
}

// ============================================================
// シーン関連
// ============================================================

export type LayoutMode = "chat" | "stage"

export type BackgroundVariants = Record<string, string>

export type Position = "left" | "right" | "center" | number

export interface SceneCharacter {
  position: Position
  layer?: number
  scale?: number
}

export type SceneCharacters = Record<string, SceneCharacter>

// ============================================================
// コマンド
// ============================================================

export interface BgmCommand {
  type: "bgm"
  assetId: string
  volume?: number
  fadeIn?: number
}

export interface BgmStopCommand {
  type: "bgm_stop"
  fadeOut?: number
}

export interface SeCommand {
  type: "se"
  assetId: string
  volume?: number
}

export interface BackgroundCommand {
  type: "background"
  value: string
  transition?: "fade" | "slide" | "none"
  duration?: number
}

export type SceneCommand =
  | BgmCommand
  | BgmStopCommand
  | SeCommand
  | BackgroundCommand

// ============================================================
// ダイアログ
// ============================================================

export interface Dialogue {
  speaker: string
  text: string
  sprite?: string
  position?: Position
  layer?: number
  scale?: number
  commands?: SceneCommand[]
}

// ============================================================
// シーン
// ============================================================

export interface Scene {
  id: string
  layout: LayoutMode
  backgrounds: BackgroundVariants
  initialBackground: string
  characters: SceneCharacters
  initialBgm?: {
    assetId: string
    volume?: number
  }
  dialogues: Dialogue[]
}
