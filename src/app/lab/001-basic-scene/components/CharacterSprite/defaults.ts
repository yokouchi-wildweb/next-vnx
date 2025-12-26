// src/app/lab/001-basic-scene/components/CharacterSprite/defaults.ts

import type { CharacterSpriteStyle } from "./types"

/**
 * CharacterSprite のデフォルトスタイル設定
 */
export const defaultCharacterSpriteStyle: CharacterSpriteStyle = {
  layout: {
    // 画面幅の何%（キャラクター幅）
    widthPercent: 40,
    // 画面高さの何%上に引き上げ
    verticalPullUp: 0.8,
    // 幅の何%を画面外に見切れさせる
    horizontalOverflow: 0.1,
  },
  alpha: {
    // アクティブ（発言中）
    active: 1.0,
    // 非アクティブ
    inactive: 0.7,
    // トランジション時間（ms）
    transitionDuration: 300,
  },
}
