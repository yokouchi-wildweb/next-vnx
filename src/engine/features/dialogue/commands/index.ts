/**
 * Dialogue Commands
 *
 * Dialogue Feature のコマンドハンドラー
 */

import type { Scene } from "@/engine/types"
import { dialogueStore } from "../stores"
import type { DialogueMessage } from "../stores"

export const dialogueCommands = {
  /**
   * 初期化（scene 全体から必要なデータを取り出す）
   */
  init: (_scene: Scene) => {
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
