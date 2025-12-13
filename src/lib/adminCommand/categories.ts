// src/lib/adminCommand/categories.ts

import type { ComponentType, ReactNode } from "react";
import type { CategoryRendererProps } from "./types";
import { NavigationRenderer } from "./definitions/navigation/NavigationRenderer";
import { SettingsRenderer } from "./definitions/settings/SettingsRenderer";

/**
 * カテゴリの設定
 */
export type CategoryConfig = {
  /** カテゴリID */
  id: string;
  /** 表示ラベル */
  label: string;
  /** 説明文 */
  description?: string;
  /** アイコン */
  icon?: ReactNode;
  /** カスタムレンダラー */
  Renderer: ComponentType<CategoryRendererProps>;
};

/**
 * 第1メニューに表示するカテゴリ一覧
 * 新しいカテゴリを追加する場合:
 * 1. definitions/ に専用フォルダを作成
 * 2. レンダラーコンポーネントを実装
 * 3. ここに登録
 */
export const categories: CategoryConfig[] = [
  {
    id: "navigation",
    label: "ナビゲーション (navigate)",
    description: "ページ移動",
    Renderer: NavigationRenderer,
  },
  {
    id: "settings",
    label: "アプリ設定の変更 (config)",
    description: "設定値を変更",
    Renderer: SettingsRenderer,
  },
];
