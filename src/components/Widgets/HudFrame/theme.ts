import { HudFrameVariant, HudFrameAccentColor } from "./types";

/** アクセントカラー設定 */
type AccentColorConfig = {
  // ボーダー・装飾
  borderClass: string;
  dotClass: string;
  // テキスト
  iconClass: string;
  textClass: string;
  starClass: string;
  // ステータス
  arrowClass: string;
  dividerClass: string;
  onlineClass: string;
  progressStarClass: string;
  // カラー値（CSS用）
  glowRgba: string;
  lightRgba: string;
  gridRgba: string;
};

/** アクセントカラー設定（dark用） */
const ACCENT_COLORS_DARK: Record<HudFrameAccentColor, AccentColorConfig> = {
  cyan: {
    borderClass: "border-cyan-400/60",
    dotClass: "bg-cyan-400/80",
    iconClass: "text-cyan-400",
    textClass: "text-cyan-300/80",
    starClass: "text-cyan-400/60",
    arrowClass: "text-cyan-400/80",
    dividerClass: "text-cyan-400/40",
    onlineClass: "text-cyan-400/60",
    progressStarClass: "text-purple-400/60",
    glowRgba: "rgba(6, 182, 212, 0.15)",
    lightRgba: "rgba(6, 182, 212, 0.5)",
    gridRgba: "rgba(6, 182, 212, 0.5)",
  },
  pink: {
    borderClass: "border-pink-400/60",
    dotClass: "bg-pink-400/80",
    iconClass: "text-pink-400",
    textClass: "text-pink-300/80",
    starClass: "text-pink-400/60",
    arrowClass: "text-pink-400/80",
    dividerClass: "text-pink-400/40",
    onlineClass: "text-pink-400/60",
    progressStarClass: "text-purple-400/60",
    glowRgba: "rgba(244, 114, 182, 0.15)",
    lightRgba: "rgba(244, 114, 182, 0.5)",
    gridRgba: "rgba(244, 114, 182, 0.5)",
  },
  purple: {
    borderClass: "border-purple-400/60",
    dotClass: "bg-purple-400/80",
    iconClass: "text-purple-400",
    textClass: "text-purple-300/80",
    starClass: "text-purple-400/60",
    arrowClass: "text-purple-400/80",
    dividerClass: "text-purple-400/40",
    onlineClass: "text-purple-400/60",
    progressStarClass: "text-cyan-400/60",
    glowRgba: "rgba(168, 85, 247, 0.15)",
    lightRgba: "rgba(168, 85, 247, 0.5)",
    gridRgba: "rgba(168, 85, 247, 0.5)",
  },
  green: {
    borderClass: "border-emerald-400/60",
    dotClass: "bg-emerald-400/80",
    iconClass: "text-emerald-400",
    textClass: "text-emerald-300/80",
    starClass: "text-emerald-400/60",
    arrowClass: "text-emerald-400/80",
    dividerClass: "text-emerald-400/40",
    onlineClass: "text-emerald-400/60",
    progressStarClass: "text-cyan-400/60",
    glowRgba: "rgba(52, 211, 153, 0.15)",
    lightRgba: "rgba(52, 211, 153, 0.5)",
    gridRgba: "rgba(52, 211, 153, 0.5)",
  },
  orange: {
    borderClass: "border-orange-400/60",
    dotClass: "bg-orange-400/80",
    iconClass: "text-orange-400",
    textClass: "text-orange-300/80",
    starClass: "text-orange-400/60",
    arrowClass: "text-orange-400/80",
    dividerClass: "text-orange-400/40",
    onlineClass: "text-orange-400/60",
    progressStarClass: "text-pink-400/60",
    glowRgba: "rgba(251, 146, 60, 0.15)",
    lightRgba: "rgba(251, 146, 60, 0.5)",
    gridRgba: "rgba(251, 146, 60, 0.5)",
  },
};

/** アクセントカラー設定（light用） */
const ACCENT_COLORS_LIGHT: Record<HudFrameAccentColor, AccentColorConfig> = {
  cyan: {
    borderClass: "border-cyan-500/50",
    dotClass: "bg-cyan-500/70",
    iconClass: "text-cyan-500",
    textClass: "text-cyan-600/90",
    starClass: "text-cyan-500/70",
    arrowClass: "text-cyan-500/80",
    dividerClass: "text-cyan-400/50",
    onlineClass: "text-cyan-500/80",
    progressStarClass: "text-purple-500/70",
    glowRgba: "rgba(6, 182, 212, 0.2)",
    lightRgba: "rgba(6, 182, 212, 0.6)",
    gridRgba: "rgba(6, 182, 212, 0.3)",
  },
  pink: {
    borderClass: "border-pink-500/50",
    dotClass: "bg-pink-500/70",
    iconClass: "text-pink-500",
    textClass: "text-pink-600/90",
    starClass: "text-pink-500/70",
    arrowClass: "text-pink-500/80",
    dividerClass: "text-pink-400/50",
    onlineClass: "text-pink-500/80",
    progressStarClass: "text-purple-500/70",
    glowRgba: "rgba(244, 114, 182, 0.2)",
    lightRgba: "rgba(244, 114, 182, 0.6)",
    gridRgba: "rgba(244, 114, 182, 0.3)",
  },
  purple: {
    borderClass: "border-purple-500/50",
    dotClass: "bg-purple-500/70",
    iconClass: "text-purple-500",
    textClass: "text-purple-600/90",
    starClass: "text-purple-500/70",
    arrowClass: "text-purple-500/80",
    dividerClass: "text-purple-400/50",
    onlineClass: "text-purple-500/80",
    progressStarClass: "text-cyan-500/70",
    glowRgba: "rgba(168, 85, 247, 0.2)",
    lightRgba: "rgba(168, 85, 247, 0.6)",
    gridRgba: "rgba(168, 85, 247, 0.3)",
  },
  green: {
    borderClass: "border-emerald-500/50",
    dotClass: "bg-emerald-500/70",
    iconClass: "text-emerald-500",
    textClass: "text-emerald-600/90",
    starClass: "text-emerald-500/70",
    arrowClass: "text-emerald-500/80",
    dividerClass: "text-emerald-400/50",
    onlineClass: "text-emerald-500/80",
    progressStarClass: "text-cyan-500/70",
    glowRgba: "rgba(52, 211, 153, 0.2)",
    lightRgba: "rgba(52, 211, 153, 0.6)",
    gridRgba: "rgba(52, 211, 153, 0.3)",
  },
  orange: {
    borderClass: "border-orange-500/50",
    dotClass: "bg-orange-500/70",
    iconClass: "text-orange-500",
    textClass: "text-orange-600/90",
    starClass: "text-orange-500/70",
    arrowClass: "text-orange-500/80",
    dividerClass: "text-orange-400/50",
    onlineClass: "text-orange-500/80",
    progressStarClass: "text-pink-500/70",
    glowRgba: "rgba(251, 146, 60, 0.2)",
    lightRgba: "rgba(251, 146, 60, 0.6)",
    gridRgba: "rgba(251, 146, 60, 0.3)",
  },
};

/** ベーステーマ設定の型 */
export type HudFrameBaseTheme = {
  // フレーム
  frameBg: string;
  frameBorderOpacity: string;
  innerBorderOpacity: string;
  boxShadow: string;
  scanline: string;
  reflectionOpacity: string;
  // タイトルバー
  titleBarBorderOpacity: string;
  titleSubtext: string;
  dividerBg: string;
  windowDots: { pink: string; cyan: string; purple: string };
  // ステータスバー
  statusText: string;
  progressBg: string;
  progressBar: string;
};

/** ベーステーマ設定（variant依存） */
const BASE_THEMES: Record<HudFrameVariant, HudFrameBaseTheme> = {
  dark: {
    frameBg: "from-slate-900/90 via-slate-900/80 to-purple-950/30",
    frameBorderOpacity: "/30",
    innerBorderOpacity: "/30",
    boxShadow: `0 0 0 1px rgba(6, 182, 212, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 20px 50px -20px rgba(0, 0, 0, 0.5)`,
    scanline: "rgba(255, 255, 255, 0.5)",
    reflectionOpacity: "opacity-20",
    titleBarBorderOpacity: "/20",
    titleSubtext: "text-white/40",
    dividerBg: "bg-white/30",
    windowDots: {
      pink: "bg-pink-400/60",
      cyan: "bg-cyan-400/60",
      purple: "bg-purple-400/60",
    },
    statusText: "text-white/50",
    progressBg: "bg-slate-800/50",
    progressBar: "from-cyan-500 to-purple-500",
  },
  light: {
    frameBg: "from-white/70 via-slate-50/60 to-purple-50/50",
    frameBorderOpacity: "/40",
    innerBorderOpacity: "/40",
    boxShadow: `0 0 0 1px rgba(6, 182, 212, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8), 0 20px 50px -20px rgba(0, 0, 0, 0.15)`,
    scanline: "rgba(0, 0, 0, 0.03)",
    reflectionOpacity: "opacity-30",
    titleBarBorderOpacity: "/30",
    titleSubtext: "text-slate-500/60",
    dividerBg: "bg-slate-400/40",
    windowDots: {
      pink: "bg-pink-400",
      cyan: "bg-cyan-400",
      purple: "bg-purple-400",
    },
    statusText: "text-slate-600/70",
    progressBg: "bg-slate-200/80",
    progressBar: "from-cyan-400 to-purple-400",
  },
};

/** 統合されたテーマ */
export type HudFrameTheme = HudFrameBaseTheme & AccentColorConfig;

/** テーマを取得するヘルパー */
export function getHudFrameTheme(
  variant: HudFrameVariant,
  accentColor: HudFrameAccentColor = "cyan"
): HudFrameTheme {
  const baseTheme = BASE_THEMES[variant];
  const accentConfig =
    variant === "dark"
      ? ACCENT_COLORS_DARK[accentColor]
      : ACCENT_COLORS_LIGHT[accentColor];

  return {
    ...baseTheme,
    ...accentConfig,
  };
}

/** アクセントカラー設定を取得 */
export function getAccentColorConfig(
  variant: HudFrameVariant,
  accentColor: HudFrameAccentColor
): AccentColorConfig {
  return variant === "dark"
    ? ACCENT_COLORS_DARK[accentColor]
    : ACCENT_COLORS_LIGHT[accentColor];
}
