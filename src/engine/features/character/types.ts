/**
 * Character Feature 型定義
 */

/** 2D座標（相対値 0-1） */
export type Position2D = {
  /** X座標（0=左端、1=右端） */
  x: number
  /** Y座標（0=上端、1=下端） */
  y: number
}

/** Standing スプライトの Props */
export type StandingProps = {
  /** スプライト画像のパス */
  spritePath: string
  /** 画面上の位置（相対座標 0-1） */
  position: Position2D
  /** スケール（デフォルト 1.0） */
  scale?: number
  /** 透明度（デフォルト 1.0） */
  alpha?: number
  /** アンカーポイント（デフォルト 下中央 { x: 0.5, y: 1 }） */
  anchor?: Position2D
  /** zIndex */
  zIndex?: number
}
