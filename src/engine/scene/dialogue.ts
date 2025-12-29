/**
 * Dialogue Scene（ダイアログシーン）
 *
 * チャット/ノベル形式の会話シーン
 * - 背景表示
 * - キャラクター立ち絵
 * - メッセージ表示
 */

import type { SceneTypeDefinition } from "@/engine/types"
import { Background, Character, Dialogue } from "@/engine/features"
import { sprite, customLayer, widget } from "@/engine/core/arrangement"

/**
 * ダイアログシーン定義
 */
export const dialogueScene: SceneTypeDefinition = {
  // 使用する Feature
  features: [Background, Character, Dialogue],

  // デフォルトの配置設定
  arrangement: {
    // PixiJS Sprite（Canvas内）
    sprites: [
      sprite(Background, "Background", 0),
      sprite(Character, "Character", 10),
    ],

    // HTML Layer
    layers: [
      // Widget をグループ化して Layer を構成
      customLayer(100, [
        widget(Dialogue, "MessageList"),
        widget(Character, "NameCard", 10),
      ]),
    ],
  },
}
