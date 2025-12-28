/**
 * Dialogue Feature
 *
 * メッセージ表示機能を提供
 * - チャット風メッセージ一覧
 * - 状態管理（メッセージ履歴、現在の話者）
 */

// バンドルエクスポート
export { Dialogue } from "./exports"

// 型（バンドル外から直接使用する場合）
export type { DialogueMessage, MessageSide, DialogueState } from "./stores"
export type { MessageListLayout } from "./types"
