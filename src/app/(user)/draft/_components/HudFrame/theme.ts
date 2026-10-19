/**
 * HUDフレームテーマ
 * - アクセントカラー: CSS変数 --hud-accent を参照（クラスは hud-accent トークン経由、inline style は rgb(var(--hud-accent)) 直参照）
 * - モード: プリセットから取得した値を使用
 * - 色トークン定義: src/styles/custom/hud.css
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
    frameBorderClass: "border-hud-accent/30",
    innerBorderClass: "border-hud-accent/30",
    boxShadow: `0 0 0 1px ${accentAlpha(0.1)}, inset 0 1px 0 ${m.innerHighlight}, 0 20px 50px -20px ${m.dropShadow}`,
    scanline: m.scanline,
    reflectionOpacity: "opacity-20",
    glowRgba: accentAlpha(0.15),
    lightRgba: accentAlpha(0.5),

    // タイトルバー
    titleBarBorderClass: "border-hud-accent/20",
    titleSubtext: m.subtextClass,
    dividerBg: m.dividerClass,
    iconClass: "text-hud-accent",
    textClass: "text-hud-accent/80",
    starClass: "text-hud-accent/60",
    windowDots: {
      pink: "bg-hud-tertiary/60",
      accent: "bg-hud-accent/60",
      purple: "bg-hud-secondary-soft/60",
    },
    windowDotShadows: {
      pink: `rgb(${FIXED_COLORS.pink} / 0.5)`,
      accent: accentAlpha(0.5),
      purple: `rgb(${FIXED_COLORS.purple} / 0.5)`,
    },

    // コンテンツ
    contentText: m.contentTextClass,

    // ステータスバー
    arrowClass: "text-hud-accent/80",
    statusText: m.statusTextClass,
    progressBg: m.progressBgClass,
    progressBar: "from-hud-accent to-hud-secondary",
    progressStarClass: "text-hud-secondary-soft/60",

    // 反射グラデーション用
    reflectionGradient: `linear-gradient(90deg, ${accentAlpha(0.5)}, rgb(${FIXED_COLORS.purple} / 0.5))`,
    glowGradient: `linear-gradient(135deg, ${accentAlpha(0.15)}, rgb(${FIXED_COLORS.purple} / 0.15), rgb(${FIXED_COLORS.pink} / 0.1))`,
  } as const;
}

/** デフォルトテーマ（後方互換用） */
export const HUD_FRAME_THEME = createHudFrameTheme("dark");

export type HudFrameTheme = ReturnType<typeof createHudFrameTheme>;
