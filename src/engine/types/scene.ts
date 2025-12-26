/**
 * シーンデータの型定義
 *
 * シーンはシナリオ内の1つの場面を表し、
 * 背景、登場キャラクター、ダイアログを含む
 */

// ============================================================
// レイアウト
// ============================================================

/**
 * レイアウトモード
 * - chat: 左右にキャラ固定、中央チャット形式（パターン1）
 * - stage: 自由配置、下部メッセージウィンドウ（パターン2）
 */
export type LayoutMode = "chat" | "stage"

// ============================================================
// 背景
// ============================================================

/**
 * 背景バリエーション
 * キー: 背景の識別子（default, night, rain など）
 * 値: アセットパス
 */
export type BackgroundVariants = Record<string, string>

// ============================================================
// キャラクター
// ============================================================

/**
 * ポジション
 * - 文字列: プリセット（left, right, center など）
 * - 数値: 0-1 で画面上の位置（0=左端, 1=右端）
 */
export type Position = "left" | "right" | "center" | number

/**
 * シーン内のキャラクター設定
 */
export interface SceneCharacter {
  /** デフォルトの位置 */
  position: Position
  /** デフォルトのレイヤー（前後関係、省略時は0） */
  layer?: number
  /** デフォルトの拡大率（省略時は1.0） */
  scale?: number
}

/**
 * シーン内のキャラクター定義
 * キー: キャラクターID
 */
export type SceneCharacters = Record<string, SceneCharacter>

// ============================================================
// コマンド
// ============================================================

/**
 * BGM再生コマンド
 */
export interface BgmCommand {
  type: "bgm"
  /** アセットID（manifest.json のキー） */
  assetId: string
  /** 音量（0-1、省略時はデフォルト） */
  volume?: number
  /** フェードイン時間（ms、省略時は即時） */
  fadeIn?: number
}

/**
 * BGM停止コマンド
 */
export interface BgmStopCommand {
  type: "bgm_stop"
  /** フェードアウト時間（ms、省略時はデフォルト） */
  fadeOut?: number
}

/**
 * SE再生コマンド
 */
export interface SeCommand {
  type: "se"
  /** アセットID（manifest.json のキー） */
  assetId: string
  /** 音量（0-1、省略時はデフォルト） */
  volume?: number
}

/**
 * 背景変更コマンド
 */
export interface BackgroundCommand {
  type: "background"
  /** 背景のキー（backgrounds で定義したもの） */
  value: string
  /** 切り替え演出（省略時は即時） */
  transition?: "fade" | "slide" | "none"
  /** 演出時間（ms） */
  duration?: number
}

/**
 * シーンコマンド（Union型）
 */
export type SceneCommand =
  | BgmCommand
  | BgmStopCommand
  | SeCommand
  | BackgroundCommand

// ============================================================
// ダイアログ
// ============================================================

/**
 * ダイアログ（1つのセリフ）
 */
export interface Dialogue {
  /** 発言者のキャラクターID */
  speaker: string
  /** セリフ本文 */
  text: string
  /** 立ち絵キー（省略時は "default"） */
  sprite?: string
  /** 位置（省略時はキャラのデフォルト or 前回値） */
  position?: Position
  /** レイヤー（前後関係、省略時はキャラのデフォルト or 前回値） */
  layer?: number
  /** 拡大率（省略時はキャラのデフォルト or 前回値） */
  scale?: number
  /** 実行するコマンド */
  commands?: SceneCommand[]
}

// ============================================================
// シーン
// ============================================================

/**
 * シーンデータ
 */
export interface Scene {
  /** シーンID */
  id: string
  /** レイアウトモード */
  layout: LayoutMode
  /** 背景バリエーション */
  backgrounds: BackgroundVariants
  /** 初期背景のキー */
  initialBackground: string
  /** 登場キャラクター設定 */
  characters: SceneCharacters
  /** 初期BGM（省略可） */
  initialBgm?: {
    assetId: string
    volume?: number
  }
  /** ダイアログ配列 */
  dialogues: Dialogue[]
}
