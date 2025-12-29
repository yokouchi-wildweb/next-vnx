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
import { registerScene } from "./registry"

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
        style: {
          top: "0",
          bottom: "35%",
          left: "20%",
          right: "20%",
        },
      },
      {
        feature: "Character",
        component: "NameCardWidget",
        zIndex: 110,
      },
    ],
  },
}

// レジストリに登録
registerScene("dialogue", dialogueScene)
