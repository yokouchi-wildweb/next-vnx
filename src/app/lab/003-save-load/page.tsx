/**
 * Lab 003: セーブデータからの画面復元
 *
 * ゴール: セーブデータを読み込み、ゲーム画面を復元する
 *
 * データフロー:
 * 1. [済] セーブデータ取得 → Save { scenario_id, playhead, play_state }
 * 2. [済] gameState store に保存 → playhead, playState
 * 3. [済] scenario_id → useGetScenario → scenarioData store
 * 4. [ ] playhead.sceneId からシーンデータ取得 → Scene
 * 5. [ ] 画面をレンダリング
 */
"use client"

import { useEffect, useState, useMemo } from "react"
import { useSearchSave } from "@/features/save/hooks/useSearchSave"
import { useGetScenario } from "@/features/core/dummy"  // 本番: features/scenario/hooks
import { useGameStateStore } from "@/engine/stores/gameState"
import { useScenarioDataStore } from "@/engine/stores/scenarioData"
import type { Playhead } from "@/engine/stores/gameState"

export default function SaveLoadPage() {
  const [selectedSaveId, setSelectedSaveId] = useState<string | null>(null)

  const { data: saves, total, isLoading, error } = useSearchSave({
    limit: 10,
    orderBy: [["updatedAt", "DESC"]],
  })

  const { playhead, playState, loadFromSave, reset: resetGameState } = useGameStateStore()
  const { scenario, setScenario, reset: resetScenario } = useScenarioDataStore()

  // 選択中のセーブから scenario_id を取得
  const selectedScenarioId = useMemo(() => {
    if (!selectedSaveId || saves.length === 0) return null
    const save = saves.find((s) => s.id === selectedSaveId)
    return save?.scenario_id ?? null
  }, [selectedSaveId, saves])

  // シナリオデータ取得（ダミー hook）
  const { data: scenarioData } = useGetScenario(selectedScenarioId)

  // シナリオデータを store に保存
  useEffect(() => {
    if (scenarioData) {
      setScenario(scenarioData)
    }
  }, [scenarioData, setScenario])

  // セーブ選択時に gameState にロード
  useEffect(() => {
    if (!selectedSaveId || saves.length === 0) return

    const save = saves.find((s) => s.id === selectedSaveId)
    if (!save) return

    const ph = save.playhead as Playhead | null
    if (ph && typeof ph.sceneId === "string") {
      loadFromSave(ph, save.play_state)
    }
  }, [selectedSaveId, saves, loadFromSave])

  const handleReset = () => {
    setSelectedSaveId(null)
    resetGameState()
    resetScenario()
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Lab 003: セーブデータからの画面復元</h1>

      {error && (
        <div className="bg-red-900/50 border border-red-500 rounded p-4 mb-6">
          <p className="text-red-300">エラー: {String(error)}</p>
        </div>
      )}

      {isLoading && <div className="text-gray-400 mb-6">読み込み中...</div>}

      {/* セーブデータ一覧 */}
      {saves.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">セーブデータ一覧（{total}件）</h2>
          <div className="grid gap-2">
            {saves.map((save) => (
              <button
                key={save.id}
                onClick={() => setSelectedSaveId(save.id)}
                className={`text-left p-4 rounded border transition ${
                  selectedSaveId === save.id
                    ? "bg-blue-900/50 border-blue-500"
                    : "bg-gray-800 border-gray-700 hover:border-gray-500"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{save.scenario_id} / スロット {save.slot_number}</p>
                    <p className="text-sm text-gray-400 mt-1">ID: {save.id.slice(0, 8)}...</p>
                  </div>
                  <div className="text-right text-sm text-gray-400">
                    <p>プレイ時間: {save.play_time ?? 0}秒</p>
                    <p>更新: {save.updatedAt ? new Date(save.updatedAt).toLocaleString("ja-JP") : "-"}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {!isLoading && saves.length === 0 && (
        <div className="bg-yellow-900/30 border border-yellow-600 rounded p-4 mb-6">
          <p className="text-yellow-300">
            セーブデータがありません。<code>npm run db:seed</code> でシードを実行してください。
          </p>
        </div>
      )}

      {/* GameState Store */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">GameState Store</h2>
          <button onClick={handleReset} className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded">
            リセット
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded p-4">
            <h3 className="text-sm font-medium text-blue-400 mb-2">playhead</h3>
            <pre className="text-sm text-gray-300 overflow-auto">
              {JSON.stringify(playhead, null, 2) ?? "null"}
            </pre>
          </div>
          <div className="bg-gray-800 rounded p-4">
            <h3 className="text-sm font-medium text-green-400 mb-2">playState</h3>
            <pre className="text-sm text-gray-300 overflow-auto max-h-64">
              {JSON.stringify(playState, null, 2) ?? "null"}
            </pre>
          </div>
        </div>
      </section>

      {/* ScenarioData Store */}
      {scenario && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">ScenarioData Store</h2>
          <div className="bg-gray-800 rounded p-4">
            <pre className="text-sm text-gray-300 overflow-auto max-h-96">
              {JSON.stringify(scenario, null, 2)}
            </pre>
          </div>
        </section>
      )}
    </div>
  )
}
