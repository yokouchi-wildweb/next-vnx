// メインコンポーネント
export { HudFrame } from "./HudFrame";

// サブコンポーネント（単体でも使用可能）
export { HudFrameTitleBar } from "./HudFrameTitleBar";
export { HudFrameStatusBar } from "./HudFrameStatusBar";

// パーツ
export { CornerDecoration } from "./parts/CornerDecoration";

// 型
export type {
  HudFrameProps,
  HudFrameTitleBarProps,
  HudFrameStatusBarProps,
  HudFrameVariant,
  HudFrameAccentColor,
  CornerDecorationProps,
} from "./types";

// テーマ
export { getHudFrameTheme, getAccentColorConfig } from "./theme";
export type { HudFrameTheme, HudFrameBaseTheme } from "./theme";
