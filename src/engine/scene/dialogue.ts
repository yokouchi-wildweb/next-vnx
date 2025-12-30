/**
 * Dialogue Scene（ダイアログシーン）
 *
 * チャット/ノベル形式の会話シーン
 * - 背景表示
 * - キャラクター立ち絵
 * - メッセージ表示
 */

import type { SceneTypeDefinition } from "@/engine/types"
import { background, dialogue } from "@/engine/features"
import { sprite, customLayer, widget } from "@/engine/core/arrangement"

/**
 * ダイアログシーン定義
 */
export const dialogueScene: SceneTypeDefinition = {
  // 使用する Feature
  // dialogue Feature が character Feature の Standing を内部で使用
  features: [background, dialogue],

  // デフォルトの配置設定
  arrangement: {
    // PixiJS Sprite（Canvas内）
    sprites: [
      sprite(background, "Background", 0),
      // dialogue Feature の DialogueCharacters が Store から状態を取得して Standing を描画
      sprite(dialogue, "DialogueCharacters", 10),
    ],

    // HTML Layer
    layers: [
      // Widget をグループ化して Layer を構成
      customLayer(100, [
        widget(dialogue, "MessageList"),
      ]),
    ],
  },
}
