import type { ReactNode } from "react"

/**
 * パス名からアクティブ判定を行うカスタム関数
 */
export type PageTabMatcher = (pathname: string) => boolean

/**
 * タブアイテムの定義
 */
export type PageTabItem = {
  value: string // 各タブ固有の識別子
  label: ReactNode // 表示ラベル（テキスト or リッチ内容）
  href: string // 遷移先 URL
  icon?: ReactNode // ラベル左に並べる任意のアイコン
  matcher?: PageTabMatcher // アクティブ判定をカスタムしたい場合の関数
  prefetch?: boolean // Next.js Link の prefetch オプション
  replace?: boolean // Link の replace オプション
  scroll?: boolean // Link の scroll オプション
  target?: string // Link の target
  className?: string // 個別タブに付与する追加クラス
}

/**
 * タブのサイズバリアント
 */
export type PageTabSize = "xs" | "sm" | "md" | "lg" | "xl"

/**
 * サイズごとのスタイル定義
 */
export const TAB_SIZE_STYLES: Record<PageTabSize, string> = {
  xs: "h-9 px-3 text-xs",
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-5 text-sm",
  lg: "h-14 px-6 text-base",
  xl: "h-16 px-7 text-lg",
}
