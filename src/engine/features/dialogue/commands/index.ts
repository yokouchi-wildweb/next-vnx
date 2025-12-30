/**
 * Dialogue Commands
 *
 * SceneController から呼び出される初期化・リセット処理
 */

import type { Scene } from "@/engine/types"
import { internalStore } from "../stores/internalStore"
import type { DialogueMessage } from "../types"

/**
 * Scene から characters を解析して left/right のスプライトパスを取得
 */
function extractCharacterPaths(scene: Scene): {
  leftCharacter?: string
  rightCharacter?: string
} {
  const characters = scene.characters as
    | Record<
        string,
        {
          position?: string
          spritePath?: string
        }
      >
    | undefined

  if (!characters) return {}

  let leftCharacter: string | undefined
  let rightCharacter: string | undefined

  for (const charData of Object.values(characters)) {
    if (charData.position === "left" && charData.spritePath) {
      leftCharacter = charData.spritePath
    } else if (charData.position === "right" && charData.spritePath) {
      rightCharacter = charData.spritePath
    }
  }

  return { leftCharacter, rightCharacter }
}

export const commands = {
  /**
   * 初期化
   * Scene データからキャラクター情報を抽出して設定
   */
  init: (scene: Scene) => {
    const store = internalStore.getState()
    const { leftCharacter, rightCharacter } = extractCharacterPaths(scene)

    if (leftCharacter) {
      store.setLeftCharacter(leftCharacter)
    }
    if (rightCharacter) {
      store.setRightCharacter(rightCharacter)
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
