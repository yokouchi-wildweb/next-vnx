/**
 * Background Feature 型定義
 */

import type { Texture } from "pixi.js"

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

/** Switcher スプライトのスタイル設定 */
export type SwitcherStyle = {
  blur: BlurStyle
  brightness: BrightnessStyle
}

/** Switcher スプライトのProps */
export type SwitcherProps = {
  /** テクスチャ */
  texture: Texture
  /** 画面幅 */
  screenWidth: number
  /** 画面高さ */
  screenHeight: number
  /** スタイル設定（部分的にオーバーライド可能） */
  style?: Partial<SwitcherStyle>
}
