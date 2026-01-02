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
