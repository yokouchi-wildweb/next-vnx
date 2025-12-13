// src/lib/adminCommand/types.ts

import type { ReactNode } from "react";
import type { SessionUser } from "@/features/core/auth/entities/session";

/**
 * カテゴリレンダラーが受け取る共通Props
 */
export type CategoryRendererProps = {
  /** パレットを閉じる */
  onClose: () => void;
  /** 第1メニュー（ルート）に戻る */
  onBack: () => void;
  /** 現在のユーザー情報 */
  user: SessionUser;
};

/**
 * パレットの表示状態
 */
export type PaletteView =
  | { type: "root" }
  | { type: "category"; categoryId: string };

/**
 * ナビゲーション項目の定義
 */
export type NavigationItem = {
  /** 一意識別子 */
  id: string;
  /** 表示ラベル */
  label: string;
  /** 説明文 */
  description?: string;
  /** アイコン */
  icon?: ReactNode;
  /** 遷移先URL */
  href: string;
  /** キーワード（検索用） */
  keywords?: string[];
};

/**
 * 設定項目の入力タイプ
 */
export type SettingInputType = "text" | "number";

/**
 * 設定項目の定義
 */
export type SettingFieldConfig = {
  /** 設定キー（Setting モデルのフィールド名） */
  key: string;
  /** 表示ラベル */
  label: string;
  /** 説明文 */
  description?: string;
  /** 入力タイプ */
  type: SettingInputType;
  /** プレースホルダー */
  placeholder?: string;
  /** バリデーション設定 */
  validation?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
  };
};
