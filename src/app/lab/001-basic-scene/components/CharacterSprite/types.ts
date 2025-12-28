// src/app/lab/001-basic-scene/components/CharacterSprite/types.ts

import type { Texture } from "pixi.js"

/**
 * CharacterSprite コンポーネントの型定義
 */

/** 配置方向 */
export type SpriteSide = "left" | "right"

/** レイアウト設定 */
export type CharacterLayoutStyle = {
  /** 画面幅に対するキャラクター幅（%） */
  widthPercent: number
  /** 画面高さに対する上方向引き上げ（0-1） */
  verticalPullUp: number
  /** キャラクター幅に対する画面外見切れ量（0-1） */
  horizontalOverflow: number
}

/** 透明度設定 */
export type CharacterAlphaStyle = {
  /** アクティブ時の透明度 */
  active: number
  /** 非アクティブ時の透明度 */
  inactive: number
  /** トランジション時間（ms） */
  transitionDuration: number
}

/** CharacterSprite 全体のスタイル設定 */
export type CharacterSpriteStyle = {
  layout: CharacterLayoutStyle
  alpha: CharacterAlphaStyle
}

/** CharacterSprite コンポーネントのProps */
export type CharacterSpriteProps = {
  /** テクスチャ */
  texture: Texture
  /** 配置方向（左/右） */
  side: SpriteSide
  /** アクティブ状態（発言中かどうか） */
  isActive: boolean
  /** 画面幅 */
  screenWidth: number
  /** 画面高さ */
  screenHeight: number
  /** スタイル設定（部分的にオーバーライド可能） */
  style?: Partial<CharacterSpriteStyle>
}
