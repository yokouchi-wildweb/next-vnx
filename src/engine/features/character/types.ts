/**
 * Character Feature 型定義
 */

/** Standing スプライトの Props */
export type StandingProps = {
  /** スプライト画像のパス */
  spritePath: string

  // Position
  /** X座標（0=左端、1=右端） */
  x: number
  /** Y座標（0=上端、1=下端） */
  y: number

  // Size
  /** 画面幅に対するサイズ（%） */
  widthPercent: number

  // Anchor
  /** アンカー X（0=左端、1=右端） */
  anchorX?: number
  /** アンカー Y（0=上端、1=下端） */
  anchorY?: number

  // Transform
  /** 回転（ラジアン） */
  rotation?: number
  /** 回転（度数）- rotation より優先 */
  angle?: number
  /** 変形の中心 X（ピクセル） */
  pivotX?: number
  /** 変形の中心 Y（ピクセル） */
  pivotY?: number
  /** 傾斜 X */
  skewX?: number
  /** 傾斜 Y */
  skewY?: number

  // Appearance
  /** 透明度（0-1） */
  alpha?: number
  /** zIndex */
  zIndex?: number
}
