/**
 * シナリオデータの型定義
 *
 * シナリオは複数のシーンを含む物語全体を表し、
 * キャラクター定義などの共通設定を持つ
 */

// ============================================================
// シナリオタイプ
// ============================================================

/**
 * シナリオの種類
 * - visual-novel: 通常のビジュアルノベル形式
 * - murder-mystery: マーダーミステリー形式
 */
export type ScenarioType = "visual-novel" | "murder-mystery"

// ============================================================
// キャラクター
// ============================================================

/**
 * 立ち絵バリエーション
 * キー: 表情名（default, happy, angry など）
 * 値: アセットパス（拡張子なし）
 */
export type SpriteVariants = Record<string, string>

/**
 * キャラクター定義
 */
export interface CharacterDef {
  /** 表示名 */
  name: string
  /** テーマカラー（HEX形式） */
  color: string
  /** 立ち絵バリエーション */
  sprites: SpriteVariants
}

/**
 * キャラクター定義マップ
 * キー: キャラクターID
 */
export type CharacterDefs = Record<string, CharacterDef>

// ============================================================
// シナリオ
// ============================================================

/**
 * シナリオデータ
 */
export interface Scenario {
  /** シナリオID（ディレクトリ名と一致） */
  id: string
  /** シナリオタイトル */
  title: string
  /** シナリオタイプ */
  type: ScenarioType
  /** 説明文（省略可） */
  description?: string
  /** キャラクター定義 */
  characters: CharacterDefs
}
