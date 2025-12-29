/**
 * MessageList コンポーネントの型定義
 */

import type { CSSProperties } from "react"
import type { MessageListLayout } from "../../types"

/** MessageList コンポーネントのProps */
export type MessageListProps = {
  /** 配置設定（オーバーライド可能） */
  layout?: Partial<MessageListLayout>
  /** 追加のスタイル */
  style?: CSSProperties
  /** 追加のクラス名 */
  className?: string
}
