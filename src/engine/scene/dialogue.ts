/**
 * Dialogue Scene（ダイアログシーン）
 *
 * チャット/ノベル形式の会話シーン
 * - 背景表示
 * - キャラクター立ち絵
 * - メッセージ表示
 * - BGM/SE
 */

import type { SceneTypeDefinition } from "@/engine/types"

/**
 * ダイアログシーン定義
 */
export const dialogueScene: SceneTypeDefinition = {
  // 使用する Feature
  features: ["Background", "Character", "Dialogue", "Audio"],

  // デフォルトの配置設定
  arrangement: {
    // PixiJS Sprite（Canvas内）
    sprites: [
      {
        feature: "Background",
        component: "BackgroundSprite",
        zIndex: 0,
      },
      {
        feature: "Character",
        component: "CharacterSprite",
        zIndex: 10,
      },
    ],

    // HTML Widget
    widgets: [
      {
        feature: "Dialogue",
        component: "MessageListWidget",
        zIndex: 100,
      },
      {
        feature: "Character",
        component: "NameCardWidget",
        zIndex: 110,
      },
    ],
  },
}
