/** HUDフレーム アクセントカラー プリセット（CSS変数 --hud-accent に渡す RGB 三つ組） */
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

/**
 * HUDフレーム モードプリセット（ダーク/ライト）
 * 色クラスは src/styles/hud.css の hud-* / hud-light-* トークンを使う（生パレット色は lint 禁止）
 */
export const HUD_MODE_PRESETS = {
  dark: {
    // フレーム背景
    frameBg: "from-hud-surface/90 via-hud-surface/80 to-hud-surface-tint/30",
    // シャドウ
    innerHighlight: "rgba(255, 255, 255, 0.05)",
    dropShadow: "rgba(0, 0, 0, 0.5)",
    // スキャンライン
    scanline: "rgba(255, 255, 255, 0.5)",
    // テキスト
    subtextClass: "text-hud-foreground/40",
    statusTextClass: "text-hud-foreground/50",
    contentTextClass: "text-hud-foreground/90",
    // 区切り線
    dividerClass: "bg-hud-foreground/30",
    // プログレスバー
    progressBgClass: "bg-hud-track/50",
  },
  light: {
    // フレーム背景
    frameBg: "from-hud-light-surface/95 via-hud-light-surface-2/90 to-hud-light-surface-tint/30",
    // シャドウ
    innerHighlight: "rgba(255, 255, 255, 0.8)",
    dropShadow: "rgba(0, 0, 0, 0.15)",
    // スキャンライン
    scanline: "rgba(0, 0, 0, 0.15)",
    // テキスト
    subtextClass: "text-hud-light-muted",
    statusTextClass: "text-hud-light-muted",
    contentTextClass: "text-hud-light-foreground",
    // 区切り線
    dividerClass: "bg-hud-light-divider",
    // プログレスバー
    progressBgClass: "bg-hud-light-track/50",
  },
} as const;

export type HudMode = keyof typeof HUD_MODE_PRESETS;

/** デフォルトのモード */
export const DEFAULT_HUD_MODE: HudMode = "dark";
