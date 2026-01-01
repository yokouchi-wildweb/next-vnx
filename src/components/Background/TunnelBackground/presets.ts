/**
 * トンネル背景のプリセット設定集
 *
 * 新しいプリセットを追加するには:
 * 1. Lab 004 で設定を調整
 * 2. 「現在の設定をJSONコピー」でコピー
 * 3. ここに追加
 */

import type { TunnelSVGOptions } from "./generator"

/** プリセット名の型 */
export type TunnelPresetName = keyof typeof tunnelPresets

/** プリセット設定 */
export const tunnelPresets = {
  /**
   * 五角形ディープ
   * 五角形 × 50レイヤー、強い遠近感
   * vket風のグラデーション（水色→ピンク）
   */
  pentagonDeep: {
    sides: 5,
    layers: 50,
    strokeWidth: 2,
    strokeOpacity: 0.25,
    gradientStart: "#5dbdff",
    gradientEnd: "#dc72ff",
    minScale: 0.22,
    maxScale: 1.4,
    drawRadialLines: true,
    perspectivePower: 5,
  },

  /**
   * vket風（オリジナル再現）
   * 四角形 × 20レイヤー
   */
  vketStyle: {
    sides: 4,
    layers: 20,
    strokeWidth: 1,
    strokeOpacity: 0.25,
    gradientStart: "#5dbdff",
    gradientEnd: "#dc72ff",
    minScale: 0.08,
    maxScale: 1.5,
    drawRadialLines: true,
    perspectivePower: 2,
  },

  /**
   * サイバー六角
   * 六角形 × 緑〜青グラデーション
   */
  cyberHex: {
    sides: 6,
    layers: 15,
    strokeWidth: 1,
    strokeOpacity: 0.3,
    gradientStart: "#00ff88",
    gradientEnd: "#0088ff",
    minScale: 0.08,
    maxScale: 1.5,
    drawRadialLines: true,
    perspectivePower: 2.5,
  },

  /**
   * ワープ
   * 強烈な遠近感、SF風
   */
  warp: {
    sides: 4,
    layers: 40,
    strokeWidth: 1,
    strokeOpacity: 0.15,
    gradientStart: "#0a0a0a",
    gradientEnd: "#1a1a2e",
    minScale: 0.08,
    maxScale: 1.5,
    drawRadialLines: true,
    perspectivePower: 5,
  },

  /**
   * 深淵
   * ダークテーマ、強い奥行き
   */
  abyss: {
    sides: 4,
    layers: 35,
    strokeWidth: 1,
    strokeOpacity: 0.2,
    gradientStart: "#1a1a2e",
    gradientEnd: "#16213e",
    minScale: 0.08,
    maxScale: 1.5,
    drawRadialLines: true,
    perspectivePower: 4,
  },
  darkNet: {
    "sides": 5,
    "layers": 50,
    "strokeWidth": 2,
    "strokeOpacity": 0.15,
    "gradientStart": "#1e71a9",
    "gradientEnd": "#2b0038",
    "minScale": 0.22,
    "maxScale": 1.4,
    "drawRadialLines": true,
    "perspectivePower": 5,
    "gradientAngle": 315
  }

} as const satisfies Record<string, TunnelSVGOptions>

/**
 * プリセット名からオプションを取得
 */
export function getPreset(name: TunnelPresetName): TunnelSVGOptions {
  return tunnelPresets[name]
}

/**
 * 利用可能なプリセット名一覧
 */
export const presetNames = Object.keys(tunnelPresets) as TunnelPresetName[]
