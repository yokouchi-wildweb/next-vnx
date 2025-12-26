// src/app/lab/001-basic-scene/components/BackgroundSprite/types.ts

import type { Texture } from "pixi.js"

/**
 * BackgroundSprite コンポーネントの型定義
 */

/** ぼかしフィルター設定 */
export type BlurStyle = {
  /** ぼかしの強さ */
  strength: number
  /** ぼかしの品質（高いほど滑らか） */
  quality: number
}

/** 明るさフィルター設定 */
export type BrightnessStyle = {
  /** 明るさ（0-1、1が元の明るさ） */
  value: number
}

/** BackgroundSprite 全体のスタイル設定 */
export type BackgroundSpriteStyle = {
  blur: BlurStyle
  brightness: BrightnessStyle
}

/** BackgroundSprite コンポーネントのProps */
export type BackgroundSpriteProps = {
  /** テクスチャ */
  texture: Texture
  /** 画面幅 */
  screenWidth: number
  /** 画面高さ */
  screenHeight: number
  /** スタイル設定（部分的にオーバーライド可能） */
  style?: Partial<BackgroundSpriteStyle>
}
