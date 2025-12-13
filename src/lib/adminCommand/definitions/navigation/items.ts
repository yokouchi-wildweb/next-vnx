// src/lib/adminCommand/definitions/navigation/items.ts

import type { NavigationItem } from "../../types";

/**
 * ナビゲーション先の一覧
 * 新しいナビゲーション先を追加する場合はここに追加する
 */
export const navigationItems: NavigationItem[] = [
  {
    id: "nav-admin-home",
    label: "管理画面トップ (admin)",
    description: "管理画面のトップページに移動",
    href: "/admin",
    keywords: ["home", "top", "ダッシュボード"],
  },
  {
    id: "nav-admin-users-general",
    label: "ユーザー一覧 (users)",
    description: "一般ユーザーの管理",
    href: "/admin/users/general",
    keywords: ["user", "general", "一般"],
  },
  {
    id: "nav-admin-users-managerial",
    label: "管理者一覧 (managers)",
    description: "管理者ユーザーの管理",
    href: "/admin/users/managerial",
    keywords: ["manager", "managerial", "admin"],
  },
  {
    id: "nav-admin-settings",
    label: "システム設定 (settings)",
    description: "アプリケーションの設定",
    href: "/admin/settings",
    keywords: ["setting", "config", "設定"],
  },
];
