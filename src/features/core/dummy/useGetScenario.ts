// src/features/core/dummy/useGetScenario.ts
/**
 * ダミー: シナリオ取得フック
 *
 * 本番では features/scenario/hooks/useGetScenario に置き換え
 * インターフェースは汎用 CRUD の useGet と同じ
 */
"use client"

import useSWR from "swr"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Scenario = any

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useGetScenario(id: string | null) {
  const { data, error, isLoading } = useSWR<Scenario>(
    id ? `/game/scenarios/${id}/scenario.json` : null,
    fetcher
  )

  return {
    data: data ?? null,
    error,
    isLoading,
  }
}
