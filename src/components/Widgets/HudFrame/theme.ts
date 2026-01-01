/** HUDフレームテーマ（dark+cyan固定） */
export const HUD_FRAME_THEME = {
  // フレーム
  frameBg: "from-slate-900/90 via-slate-900/80 to-purple-950/30",
  frameBorderClass: "border-cyan-400/30",
  innerBorderClass: "border-cyan-400/30",
  boxShadow: `0 0 0 1px rgba(6, 182, 212, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 20px 50px -20px rgba(0, 0, 0, 0.5)`,
  scanline: "rgba(255, 255, 255, 0.5)",
  reflectionOpacity: "opacity-20",
  glowRgba: "rgba(6, 182, 212, 0.15)",
  lightRgba: "rgba(6, 182, 212, 0.5)",

  // タイトルバー
  titleBarBorderClass: "border-cyan-400/20",
  titleSubtext: "text-white/40",
  dividerBg: "bg-white/30",
  iconClass: "text-cyan-400",
  textClass: "text-cyan-300/80",
  starClass: "text-cyan-400/60",
  windowDots: {
    pink: "bg-pink-400/60",
    cyan: "bg-cyan-400/60",
    purple: "bg-purple-400/60",
  },
  windowDotShadows: {
    pink: "rgba(244, 114, 182, 0.5)",
    cyan: "rgba(6, 182, 212, 0.5)",
    purple: "rgba(168, 85, 247, 0.5)",
  },

  // ステータスバー
  arrowClass: "text-cyan-400/80",
  statusText: "text-white/50",
  progressBg: "bg-slate-800/50",
  progressBar: "from-cyan-500 to-purple-500",
  progressStarClass: "text-purple-400/60",
} as const;

export type HudFrameTheme = typeof HUD_FRAME_THEME;
