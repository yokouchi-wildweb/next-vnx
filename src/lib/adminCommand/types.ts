// src/lib/adminCommand/types.ts

import type { ReactNode } from "react";
import type { SessionUser } from "@/features/core/auth/entities/session";

/**
 * コマンド実行時に渡されるコンテキスト
 */
export type CommandContext = {
  /** 現在のユーザー情報 */
  user: SessionUser;
  /** 現在のパス */
  pathname: string;
  /** パレットを閉じる関数 */
  closePalette: () => void;
};

/**
 * コマンドのカテゴリ
 */
export type CommandCategory = "navigation" | "action" | "system";

/**
 * コマンドの実行結果（非同期処理用）
 */
export type CommandResult = {
  success: boolean;
  message?: string;
};

/**
 * 管理者コマンドの定義
 */
export type AdminCommand = {
  /** コマンドの一意識別子 */
  id: string;
  /** 表示ラベル */
  label: string;
  /** 説明文（検索対象にもなる） */
  description?: string;
  /** アイコン */
  icon?: ReactNode;
  /** カテゴリ */
  category: CommandCategory;
  /** コマンド実行関数 */
  execute: (context: CommandContext) => void | Promise<void | CommandResult>;
  /** 非同期処理フラグ（ローディング表示に使用） */
  isAsync?: boolean;
  /** キーワード（検索用の追加キーワード） */
  keywords?: string[];
  /** コマンドが利用可能かどうかを判定する関数 */
  isAvailable?: (context: Omit<CommandContext, "closePalette">) => boolean;
};

/**
 * カテゴリの表示情報
 */
export const CATEGORY_LABELS: Record<CommandCategory, string> = {
  navigation: "ナビゲーション",
  action: "アクション",
  system: "システム",
};
