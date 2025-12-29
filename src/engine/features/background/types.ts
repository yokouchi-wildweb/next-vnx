/**
 * Background Feature 型定義
 */

/** フィルター設定（オプション） */
export type BackgroundFilters = {
  /** ぼかしの強さ（0 = なし） */
  blur?: number
  /** ぼかしの品質 */
  blurQuality?: number
  /** 明るさ（0-1、1が元の明るさ、省略時フィルターなし） */
  brightness?: number
}

/** Background Sprite の Props */
export type BackgroundProps = {
  /** 画像パス（完全パス） */
  imagePath: string
  /** フィルター設定 */
  filters?: BackgroundFilters
  /** zIndex */
  zIndex?: number
}

/** Store の状態 */
export type BackgroundState = {
  /** 背景バリエーション（key -> 完全パス） */
  backgrounds: Record<string, string>
  /** 現在の背景キー */
  currentKey: string | null
}
