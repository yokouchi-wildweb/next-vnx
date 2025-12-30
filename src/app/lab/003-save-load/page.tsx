/**
 * Lab 003: セーブデータロード
 *
 * 目的: セーブデータを取得して playState store に保存
 *
 * 検証項目:
 * - useSave / useSearchSave でセーブデータ取得
 * - playState store への保存
 * - playhead と playState の分離確認
 */
"use client"

import { useEffect, useState } from "react"
import { useSearchSave } from "@/features/save/hooks/useSearchSave"
import { useGameStateStore } from "@/engine/stores/gameState"
import type { Playhead } from "@/engine/stores/gameState"

export default function SaveLoadPage() {
  const [selectedSaveId, setSelectedSaveId] = useState<string | null>(null)

  // セーブデータを検索（最新10件）
  const { data: saves, total, isLoading, error } = useSearchSave({
    limit: 10,
    orderBy: [["updatedAt", "DESC"]],
  })

  // gameState store
  const { playhead, playState, loadFromSave, reset } = useGameStateStore()

  // セーブデータが選択されたら store にロード
  useEffect(() => {
    if (!selectedSaveId || saves.length === 0) return

    const save = saves.find((s) => s.id === selectedSaveId)
    if (!save) return

    // playhead の型チェック（簡易）
    const ph = save.playhead as Playhead | null
    if (ph && typeof ph.sceneId === "string") {
      loadFromSave(ph, save.play_state)
    }
  }, [selectedSaveId, saves, loadFromSave])

  // リセット
  const handleReset = () => {
    setSelectedSaveId(null)
    reset()
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Lab 003: セーブデータロード</h1>

      {/* エラー表示 */}
      {error && (
        <div className="bg-red-900/50 border border-red-500 rounded p-4 mb-6">
          <p className="text-red-300">エラー: {String(error)}</p>
        </div>
      )}

      {/* ローディング */}
      {isLoading && (
        <div className="text-gray-400 mb-6">読み込み中...</div>
      )}

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
                    <p className="font-medium">
                      {save.scenario_id} / スロット {save.slot_number}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      ID: {save.id.slice(0, 8)}...
                    </p>
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

      {/* セーブデータが無い場合 */}
      {!isLoading && saves.length === 0 && (
        <div className="bg-yellow-900/30 border border-yellow-600 rounded p-4 mb-6">
          <p className="text-yellow-300">
            セーブデータがありません。<code>npm run db:seed</code> でシードを実行してください。
          </p>
        </div>
      )}

      {/* Store の状態表示 */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">GameState Store</h2>
          <button
            onClick={handleReset}
            className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded"
          >
            リセット
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* playhead */}
          <div className="bg-gray-800 rounded p-4">
            <h3 className="text-sm font-medium text-blue-400 mb-2">
              playhead（エンジン共通）
            </h3>
            <pre className="text-sm text-gray-300 overflow-auto">
              {JSON.stringify(playhead, null, 2) ?? "null"}
            </pre>
          </div>

          {/* playState */}
          <div className="bg-gray-800 rounded p-4">
            <h3 className="text-sm font-medium text-green-400 mb-2">
              playState（シナリオ固有）
            </h3>
            <pre className="text-sm text-gray-300 overflow-auto max-h-64">
              {JSON.stringify(playState, null, 2) ?? "null"}
            </pre>
          </div>
        </div>
      </section>

      {/* 選択中のセーブ情報 */}
      {selectedSaveId && (
        <section>
          <h2 className="text-lg font-semibold mb-3">選択中のセーブID</h2>
          <code className="bg-gray-800 px-3 py-2 rounded text-sm">
            {selectedSaveId}
          </code>
        </section>
      )}
    </div>
  )
}
