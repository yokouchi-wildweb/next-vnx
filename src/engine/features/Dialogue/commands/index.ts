/**
 * Dialogue Commands
 *
 * Dialogue Feature のコマンドハンドラー
 */

import { dialogueStore } from "../stores"
import type { DialogueMessage, MessageSide } from "../stores"

export const dialogueCommands = {
  /**
   * 初期化
   * @param data.fragments - フラグメント定義（将来拡張）
   * @param data.initialFragment - 開始フラグメント（将来拡張）
   */
  init: (_data: { fragments?: unknown; initialFragment?: string }) => {
    // 現在はメッセージをクリアするのみ
    // fragments の管理は将来拡張
    dialogueStore.getState().clear()
  },

  /**
   * メッセージを追加
   */
  addMessage: (data: Omit<DialogueMessage, "id">) => {
    dialogueStore.getState().addMessage(data)
  },

  /**
   * 話者を設定
   */
  speaker: (data: { id: string | null }) => {
    dialogueStore.getState().setSpeaker(data.id)
  },

  /**
   * メッセージをクリア
   */
  clear: () => {
    dialogueStore.getState().clear()
  },

  /**
   * リセット
   */
  reset: () => {
    dialogueStore.getState().reset()
  },
}
