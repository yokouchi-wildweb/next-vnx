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
  CornerDecorationProps,
} from "./types";

// テーマ
export { HUD_FRAME_THEME } from "./theme";
export type { HudFrameTheme } from "./theme";
