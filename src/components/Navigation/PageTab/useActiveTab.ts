"use client"

import { usePathname } from "next/navigation"

import type { PageTabItem } from "./types"

/**
 * 現在のパスからアクティブなタブの value を判定するフック
 *
 * @param tabs - タブアイテムの配列
 * @returns アクティブなタブの value（見つからない場合は最初のタブ）
 */
export function useActiveTab(tabs: PageTabItem[]): string {
  const pathname = usePathname()

  if (!tabs.length) {
    return ""
  }

  const activeTab = tabs.find((tab) =>
    tab.matcher ? tab.matcher(pathname) : pathname === tab.href
  )

  return activeTab?.value ?? tabs[0]!.value
}
