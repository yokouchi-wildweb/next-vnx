// src/engine/features/Dialogue/types.ts

/**
 * Dialogue Feature の型定義
 */

// Store から再エクスポート
export type { DialogueMessage, MessageSide, DialogueState } from "./stores"

/** MessageList の配置設定 */
export type MessageListLayout = {
  /** 上端オフセット（%） */
  topOffset: number
  /** 下端オフセット（%） */
  bottomOffset: number
  /** 幅（%） */
  widthPercent: number
  /** 最小幅（px） */
  minWidth: number
  /** 最大幅（px） */
  maxWidth: number
  /** 上部フェード終了位置（%） */
  fadeTop: number
  /** 下部フェード開始位置（%） */
  fadeBottom: number
  /** 下部パディング（%） */
  paddingBottomPercent: number
}
