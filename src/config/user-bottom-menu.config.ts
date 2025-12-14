/**
 * ユーザー向けボトムナビゲーションの設定
 *
 * ★ プロジェクトごとにこのファイルを編集してカスタマイズしてください
 */

import { Dices, History, LogIn, Package, User } from "lucide-react";

import type { BottomNavItem } from "@/components/AppFrames/User/Sections/BottomNav/types";

// ============================================
// 基本設定
// ============================================

/** ボトムナビゲーションを有効にするか */
export const BOTTOM_NAV_ENABLED = true;

/** ボトムナビの高さ（px） */
export const BOTTOM_NAV_HEIGHT = 64;

// ============================================
// メニューアイテム設定
// ============================================

/** 認証済みユーザー用メニュー */
export const AUTHENTICATED_MENU_ITEMS: BottomNavItem[] = [
  {
    key: "gacha",
    label: "オリパガチャ",
    href: "/gacha",
    icon: Dices,
  },
  {
    key: "items",
    label: "獲得商品",
    href: "/items",
    icon: Package,
  },
  {
    key: "history",
    label: "当選履歴",
    href: "/history",
    icon: History,
  },
  {
    key: "mypage",
    label: "マイページ",
    href: "/mypage",
    icon: User,
  },
];

/** 未認証ユーザー用メニュー */
export const GUEST_MENU_ITEMS: BottomNavItem[] = [
  {
    key: "gacha",
    label: "オリパガチャ",
    href: "/gacha",
    icon: Dices,
  },
  {
    key: "login",
    label: "ログイン",
    href: "/login",
    icon: LogIn,
  },
];
