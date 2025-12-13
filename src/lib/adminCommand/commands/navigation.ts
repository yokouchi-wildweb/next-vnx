// src/lib/adminCommand/commands/navigation.ts

import type { AdminCommand } from "../types";

/**
 * ナビゲーション系コマンド
 */
export const navigationCommands: AdminCommand[] = [
  {
    id: "nav-admin-home",
    label: "管理画面トップ",
    description: "管理画面のトップページに移動します",
    category: "navigation",
    keywords: ["admin", "home", "top", "ダッシュボード"],
    execute: ({ closePalette }) => {
      closePalette();
      window.location.href = "/admin";
    },
  },
  {
    id: "nav-admin-users",
    label: "ユーザー管理",
    description: "ユーザー一覧ページに移動します",
    category: "navigation",
    keywords: ["user", "users", "ユーザー"],
    execute: ({ closePalette }) => {
      closePalette();
      window.location.href = "/admin/users";
    },
  },
];
