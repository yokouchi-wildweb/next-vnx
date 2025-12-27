/**
 * Character Feature
 *
 * キャラクター表示機能を提供
 * - 立ち絵スプライト
 * - 名前カード
 */

// Widget（Scene用）
export { CharacterSprite } from "./widget/CharacterSprite"
export { CharacterNameCard } from "./widget/CharacterNameCard"

// Types
export type {
  Position2D,
  Anchor2D,
  StandingProps,
  NameCardVariant,
  NameCardProps,
  UnderlineStyle,
} from "./types"

// Defaults
export { defaultStandingAnchor, defaultUnderlineStyle } from "./defaults"
