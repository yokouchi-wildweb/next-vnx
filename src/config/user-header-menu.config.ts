/**
 * ユーザー向けヘッダーナビゲーションの設定
 *
 * ★ プロジェクトごとにこのファイルを編集してカスタマイズしてください
 */

// ============================================
// 基本設定
// ============================================

/** ヘッダーナビゲーションを有効にするか */
export const HEADER_NAV_ENABLED = true;

// ============================================
// メニューアイテム設定
// ============================================

/** メニューアイテムの型（リンク用） */
export type HeaderMenuItem = {
  readonly key: string;
  readonly label: string;
  readonly href: string;
};

/** 認証済みユーザー用メニュー（ログアウト以外） */
export const AUTHENTICATED_MENU_ITEMS: HeaderMenuItem[] = [
  { key: "home", label: "ホーム", href: "/" },
  { key: "service", label: "サービス", href: "/services" },
  { key: "mypage", label: "マイページ", href: "/mypage" },
];

/** 未認証ユーザー用メニュー */
export const GUEST_MENU_ITEMS: HeaderMenuItem[] = [
  { key: "home", label: "ホーム", href: "/" },
  { key: "service", label: "サービス", href: "/services" },
  { key: "login", label: "ログイン", href: "/login" },
  { key: "signup", label: "会員登録", href: "/signup" },
];

// ============================================
// ログアウト設定
// ============================================

/** ログアウトボタンを表示するか（認証済みユーザーのみ対象） */
export const SHOW_LOGOUT_BUTTON = true;

/** ログアウトボタンのラベル */
export const LOGOUT_LABEL = "ログアウト";

/** ログアウト後のリダイレクト先 */
export const LOGOUT_REDIRECT_TO = "/login";
