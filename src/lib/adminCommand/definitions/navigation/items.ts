// src/lib/adminCommand/definitions/navigation/items.ts

import type { NavigationItem } from "../../types";

/**
 * ナビゲーション先の一覧
 * 新しいナビゲーション先を追加する場合はここに追加する
 */
export const navigationItems: NavigationItem[] = [
  {
    id: "nav-admin-home",
    label: "管理画面トップ",
    description: "管理画面のトップページに移動",
    href: "/admin",
    keywords: ["admin", "home", "top", "ダッシュボード"],
  },
  {
    id: "nav-admin-users",
    label: "ユーザー管理",
    description: "ユーザー一覧ページに移動",
    href: "/admin/users",
    keywords: ["user", "users", "ユーザー"],
  },
];
