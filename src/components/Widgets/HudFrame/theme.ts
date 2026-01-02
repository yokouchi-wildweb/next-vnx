/**
 * HUDフレームテーマ
 * CSS変数 --hud-accent を参照（実際の色はコンポーネントで注入）
 */

/** アクセントカラーのCSS変数参照 */
const accent = "rgb(var(--hud-accent))";
const accentAlpha = (alpha: number) => `rgb(var(--hud-accent) / ${alpha})`;

/** 固定色（purple, pink等のサブカラー） */
const FIXED_COLORS = {
  purple: "168 85 247",
  pink: "244 114 182",
} as const;

export const HUD_FRAME_THEME = {
  // フレーム
  frameBg: "from-slate-900/90 via-slate-900/80 to-purple-950/30",
  frameBorderClass: "border-[rgb(var(--hud-accent))]/30",
  innerBorderClass: "border-[rgb(var(--hud-accent))]/30",
  boxShadow: `0 0 0 1px ${accentAlpha(0.1)}, inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 20px 50px -20px rgba(0, 0, 0, 0.5)`,
  scanline: "rgba(255, 255, 255, 0.5)",
  reflectionOpacity: "opacity-20",
  glowRgba: accentAlpha(0.15),
  lightRgba: accentAlpha(0.5),

  // タイトルバー
  titleBarBorderClass: "border-[rgb(var(--hud-accent))]/20",
  titleSubtext: "text-white/40",
  dividerBg: "bg-white/30",
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

  // ステータスバー
  arrowClass: "text-[rgb(var(--hud-accent))]/80",
  statusText: "text-white/50",
  progressBg: "bg-slate-800/50",
  progressBar: "from-[rgb(var(--hud-accent))] to-purple-500",
  progressStarClass: "text-purple-400/60",

  // 反射グラデーション用
  reflectionGradient: `linear-gradient(90deg, ${accentAlpha(0.5)}, rgb(${FIXED_COLORS.purple} / 0.5))`,
  glowGradient: `linear-gradient(135deg, ${accentAlpha(0.15)}, rgb(${FIXED_COLORS.purple} / 0.15), rgb(${FIXED_COLORS.pink} / 0.1))`,
} as const;

export type HudFrameTheme = typeof HUD_FRAME_THEME;
