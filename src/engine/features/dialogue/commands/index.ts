/**
 * Dialogue Commands
 *
 * SceneController から呼び出される初期化・リセット処理
 */

import { internalStore } from "../stores/internalStore"
import type { DialogueMessage } from "../types"

type InitOptions = {
  /** 左キャラクターのスプライトパス */
  leftCharacter?: string
  /** 右キャラクターのスプライトパス */
  rightCharacter?: string
}

export const commands = {
  /**
   * 初期化
   */
  init: (options: InitOptions = {}) => {
    const store = internalStore.getState()

    if (options.leftCharacter) {
      store.setLeftCharacter(options.leftCharacter)
    }
    if (options.rightCharacter) {
      store.setRightCharacter(options.rightCharacter)
    }
  },

  /**
   * メッセージを追加
   */
  addMessage: (message: Omit<DialogueMessage, "id">) => {
    const store = internalStore.getState()
    store.addMessage(message)
    store.updateCharacterActiveState()
  },

  /**
   * リセット
   */
  reset: () => {
    internalStore.getState().reset()
  },
}
