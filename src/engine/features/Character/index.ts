/**
 * Character Feature
 *
 * キャラクター表示機能を提供
 * - 立ち絵スプライト
 * - 名前カード
 */

// バンドルエクスポート
export { Character } from "./exports"

// 型（バンドル外から直接使用する場合）
export type {
  Position2D,
  Anchor2D,
  StandingProps,
  NameCardVariant,
  NameCardProps,
  UnderlineStyle,
} from "./types"
export { defaultStandingAnchor, defaultUnderlineStyle } from "./defaults"
