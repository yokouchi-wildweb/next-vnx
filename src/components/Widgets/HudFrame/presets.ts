/** HUDフレーム アクセントカラー プリセット */
export const HUD_ACCENT_PRESETS = {
  cyan: "6 182 212",
  pink: "244 114 182",
  purple: "168 85 247",
  emerald: "52 211 153",
  amber: "251 191 36",
} as const;

export type HudAccent = keyof typeof HUD_ACCENT_PRESETS;

/** デフォルトのアクセントカラー */
export const DEFAULT_HUD_ACCENT: HudAccent = "cyan";

/** HUDフレーム モードプリセット（ダーク/ライト） */
export const HUD_MODE_PRESETS = {
  dark: {
    // フレーム背景
    frameBg: "from-slate-900/90 via-slate-900/80 to-purple-950/30",
    // シャドウ
    innerHighlight: "rgba(255, 255, 255, 0.05)",
    dropShadow: "rgba(0, 0, 0, 0.5)",
    // スキャンライン
    scanline: "rgba(255, 255, 255, 0.5)",
    // テキスト
    subtextClass: "text-white/40",
    statusTextClass: "text-white/50",
    contentTextClass: "text-white/90",
    // 区切り線
    dividerClass: "bg-white/30",
    // プログレスバー
    progressBgClass: "bg-slate-800/50",
  },
  light: {
    // フレーム背景
    frameBg: "from-white/95 via-slate-50/90 to-purple-50/30",
    // シャドウ
    innerHighlight: "rgba(255, 255, 255, 0.8)",
    dropShadow: "rgba(0, 0, 0, 0.15)",
    // スキャンライン
    scanline: "rgba(0, 0, 0, 0.15)",
    // テキスト
    subtextClass: "text-slate-500",
    statusTextClass: "text-slate-500",
    contentTextClass: "text-slate-800",
    // 区切り線
    dividerClass: "bg-slate-300",
    // プログレスバー
    progressBgClass: "bg-slate-200/50",
  },
} as const;

export type HudMode = keyof typeof HUD_MODE_PRESETS;

/** デフォルトのモード */
export const DEFAULT_HUD_MODE: HudMode = "dark";
