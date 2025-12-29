 /**
 * Character Commands
 *
 * Character Feature のコマンドハンドラー
 */

import { characterStore } from "../stores"
import type { Scene } from "@/engine/types"
import type { Position, SceneCharacter } from "../types"

export const characterCommands = {
  /**
   * 初期化（scene 全体から必要なデータを取り出す）
   */
  init: (scene: Scene) => {
    const characters = scene.characters as Record<string, SceneCharacter> | undefined
    if (characters) {
      characterStore.getState().initialize(characters)
    }
  },

  /**
   * キャラクターを表示
   * @param data.id - キャラクターID
   * @param data.position - 位置
   * @param data.sprite - スプライト
   */
  show: (data: { id: string; position?: Position; sprite?: string }) => {
    characterStore.getState().show(data.id, {
      position: data.position,
      sprite: data.sprite,
    })
  },

  /**
   * キャラクターを非表示
   * @param data.id - キャラクターID
   */
  hide: (data: { id: string }) => {
    characterStore.getState().hide(data.id)
  },

  /**
   * キャラクターを移動
   * @param data.id - キャラクターID
   * @param data.position - 位置
   */
  move: (data: { id: string; position: Position }) => {
    characterStore.getState().move(data.id, data.position)
  },

  /**
   * スプライトを変更
   * @param data.id - キャラクターID
   * @param data.sprite - スプライト
   */
  sprite: (data: { id: string; sprite: string }) => {
    characterStore.getState().setSprite(data.id, data.sprite)
  },

  /**
   * 話者を設定
   * @param data.id - キャラクターID
   */
  speaker: (data: { id: string | null }) => {
    characterStore.getState().setSpeaker(data.id)
  },

  /**
   * リセット
   */
  reset: () => {
    characterStore.getState().reset()
  },
}
