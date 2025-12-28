// src/app/lab/001-basic-scene/components/BackgroundSprite/defaults.ts

import type { BackgroundSpriteStyle } from "./types"

/**
 * BackgroundSprite のデフォルトスタイル設定
 */
export const defaultBackgroundSpriteStyle: BackgroundSpriteStyle = {
  blur: {
    // ぼかしの強さ
    strength: 4,
    // ぼかしの品質（高いほど滑らか）
    quality: 4,
  },
  brightness: {
    // 明るさ（0-1、1が元の明るさ）
    value: 0.6,
  },
}
