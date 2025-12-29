/**
 * Dialogue Feature デフォルト設定
 */

import type { MessageListLayout } from "./types"

// =============================================================================
// キャラクター配置
// =============================================================================

/** 左キャラクターのデフォルト X 座標 */
export const defaultLeftCharacterX = 0.18
/** 右キャラクターのデフォルト X 座標 */
export const defaultRightCharacterX = 0.82
/** キャラクターのデフォルト Y 座標（上端から20%） */
export const defaultCharacterY = 0.2
/** キャラクターのデフォルトサイズ（画面幅の40%） */
export const defaultCharacterWidthPercent = 40
/** キャラクターのデフォルトアンカー X（中央） */
export const defaultCharacterAnchorX = 0.5
/** キャラクターのデフォルトアンカー Y（上端） */
export const defaultCharacterAnchorY = 0

// =============================================================================
// 透明度
// =============================================================================

/** アクティブ（発言中）キャラクターの透明度 */
export const defaultActiveAlpha = 1.0
/** 非アクティブキャラクターの透明度 */
export const defaultInactiveAlpha = 0.7

// =============================================================================
// MessageList レイアウト
// =============================================================================

export const defaultMessageListLayout: MessageListLayout = {
  topOffset: 0,
  bottomOffset: 35,
  widthPercent: 40,
  minWidth: 300,
  maxWidth: 600,
  fadeTop: 20,
  fadeBottom: 90,
  paddingBottomPercent: 5,
  gap: 12,
}
