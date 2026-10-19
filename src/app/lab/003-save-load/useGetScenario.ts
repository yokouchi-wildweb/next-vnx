// src/app/lab/003-save-load/useGetScenario.ts
/**
 * ダミー: シナリオ取得フック(lab 専用)
 *
 * public/game/ の静的 JSON を読むだけのモック。
 * 本番では features/scenario/hooks/useGetScenario に置き換え
 * インターフェースは汎用 CRUD の useGet と同じ
 */
"use client"

import axios from "axios"
import useSWR from "swr"

type Scenario = any

const fetcher = (url: string) => axios.get<Scenario>(url).then((res) => res.data)

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
