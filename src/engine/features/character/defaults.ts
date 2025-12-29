/**
 * Character Feature デフォルト設定
 */

import type { Anchor2D, UnderlineStyle } from "./types"

/** Standing スプライトのデフォルトアンカー（下中央） */
export const defaultStandingAnchor: Anchor2D = {
  x: 0.5,
  y: 1,
}

/** Underline バリアントのデフォルトスタイル */
export const defaultUnderlineStyle: UnderlineStyle = {
  lineWidth: 3,
  textShadow: "1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 0 0 8px rgba(0,0,0,0.8)",
  fontSize: "1.125rem",  // text-lg
  fontWeight: "700",     // font-bold
}
