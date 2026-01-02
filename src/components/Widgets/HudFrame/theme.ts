/**
 * HUDフレームテーマ
 * - アクセントカラー: CSS変数 --hud-accent を参照
 * - モード: プリセットから取得した値を使用
 */

import { HUD_MODE_PRESETS, HudMode } from "./presets";

/** アクセントカラーのCSS変数参照 */
const accentAlpha = (alpha: number) => `rgb(var(--hud-accent) / ${alpha})`;

/** 固定色（purple, pink等のサブカラー） */
const FIXED_COLORS = {
  purple: "168 85 247",
  pink: "244 114 182",
} as const;

/** モードに応じたテーマを生成 */
export function createHudFrameTheme(mode: HudMode) {
  const m = HUD_MODE_PRESETS[mode];

  return {
    // フレーム
    frameBg: m.frameBg,
    frameBorderClass: "border-[rgb(var(--hud-accent))]/30",
    innerBorderClass: "border-[rgb(var(--hud-accent))]/30",
    boxShadow: `0 0 0 1px ${accentAlpha(0.1)}, inset 0 1px 0 ${m.innerHighlight}, 0 20px 50px -20px ${m.dropShadow}`,
    scanline: m.scanline,
    reflectionOpacity: "opacity-20",
    glowRgba: accentAlpha(0.15),
    lightRgba: accentAlpha(0.5),

    // タイトルバー
    titleBarBorderClass: "border-[rgb(var(--hud-accent))]/20",
    titleSubtext: m.subtextClass,
    dividerBg: m.dividerClass,
    iconClass: "text-[rgb(var(--hud-accent))]",
    textClass: "text-[rgb(var(--hud-accent))]/80",
    starClass: "text-[rgb(var(--hud-accent))]/60",
    windowDots: {
      pink: "bg-pink-400/60",
      accent: "bg-[rgb(var(--hud-accent))]/60",
      purple: "bg-purple-400/60",
    },
    windowDotShadows: {
      pink: `rgb(${FIXED_COLORS.pink} / 0.5)`,
      accent: accentAlpha(0.5),
      purple: `rgb(${FIXED_COLORS.purple} / 0.5)`,
    },

    // コンテンツ
    contentText: m.contentTextClass,

    // ステータスバー
    arrowClass: "text-[rgb(var(--hud-accent))]/80",
    statusText: m.statusTextClass,
    progressBg: m.progressBgClass,
    progressBar: "from-[rgb(var(--hud-accent))] to-purple-500",
    progressStarClass: "text-purple-400/60",

    // 反射グラデーション用
    reflectionGradient: `linear-gradient(90deg, ${accentAlpha(0.5)}, rgb(${FIXED_COLORS.purple} / 0.5))`,
    glowGradient: `linear-gradient(135deg, ${accentAlpha(0.15)}, rgb(${FIXED_COLORS.purple} / 0.15), rgb(${FIXED_COLORS.pink} / 0.1))`,
  } as const;
}

/** デフォルトテーマ（後方互換用） */
export const HUD_FRAME_THEME = createHudFrameTheme("dark");

export type HudFrameTheme = ReturnType<typeof createHudFrameTheme>;
