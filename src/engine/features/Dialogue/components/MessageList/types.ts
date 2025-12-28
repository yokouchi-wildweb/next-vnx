// src/engine/features/Dialogue/components/MessageList/types.ts

import type { CSSProperties } from "react"

/** MessageList の配置設定 */
export type MessageListLayout = {
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
  /** メッセージ間の間隔（px） */
  gap: number
}

/** MessageList コンポーネントのProps */
export type MessageListProps = {
  /** 配置設定（オーバーライド可能） */
  layout?: Partial<MessageListLayout>
  /** 追加のスタイル */
  style?: CSSProperties
  /** 追加のクラス名 */
  className?: string
}
