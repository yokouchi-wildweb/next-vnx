import { ReactNode } from "react";
import { HudAccent, HudMode } from "./presets";
import { HudFrameTheme } from "./theme";

/** HudFrame メインコンポーネントのProps */
export type HudFrameProps = {
  children: ReactNode;
  /** アクセントカラー（デフォルト: cyan） */
  accent?: HudAccent;
  /** モード（デフォルト: dark） */
  mode?: HudMode;
  /** 最大幅（CSS値: "800px", "50vw", "100%" など） */
  maxWidth?: string;
  /** 追加のクラス名 */
  className?: string;

  // タイトルバー
  /** タイトル（指定しなければタイトルバー非表示） */
  title?: string;
  /** サブタイトル */
  subtitle?: string;
  /** タイトルアイコン */
  titleIcon?: ReactNode;
  /** タイトルバー右側のカスタムコンテンツ */
  titleRight?: ReactNode;

  // ステータスバー
  /** ステータスバーを表示するか */
  showStatusBar?: boolean;
  /** ステータステキスト（左側） */
  statusText?: string;
  /** ステータス右側のカスタムコンテンツ */
  statusRight?: ReactNode;

  // 装飾オプション
  /** コーナー装飾を表示するか（デフォルト: true） */
  showCorners?: boolean;
  /** スキャンライン効果を表示するか（デフォルト: true） */
  showScanlines?: boolean;
  /** 上部ライトエフェクトを表示するか（デフォルト: true） */
  showTopLight?: boolean;
  /** 下部反射エフェクトを表示するか（デフォルト: true） */
  showReflection?: boolean;
};

/** タイトルバーのProps */
export type HudFrameTitleBarProps = {
  /** タイトル */
  title: string;
  /** サブタイトル */
  subtitle?: string;
  /** タイトルアイコン（デフォルト: ◈） */
  icon?: ReactNode;
  /** 右側のカスタムコンテンツ */
  right?: ReactNode;
  /** ウィンドウボタン風ドットを表示するか（デフォルト: true） */
  showWindowDots?: boolean;
  /** テーマ（親から渡される） */
  theme?: HudFrameTheme;
};

/** ステータスバーのProps */
export type HudFrameStatusBarProps = {
  /** ステータステキスト */
  text?: string;
  /** 右側のカスタムコンテンツ */
  right?: ReactNode;
  /** プログレスバーを表示するか（デフォルト: true） */
  showProgress?: boolean;
  /** テーマ（親から渡される） */
  theme?: HudFrameTheme;
};

/** コーナー装飾のProps */
export type CornerDecorationProps = {
  position: "tl" | "tr" | "bl" | "br";
};
