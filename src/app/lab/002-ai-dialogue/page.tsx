/**
 * Lab 002: AIダイアログ (v2)
 *
 * 目的: 好感度システム・振る舞い判定を持つNPC会話の検証
 */
"use client"

import { useState, useRef, useEffect } from "react"
import axios from "axios"
import { useAppToast } from "@/hooks/useAppToast"
import {
  NPCConfig,
  NPCDialogueRequest,
  NPCDialogueResponse,
  ChatMessage,
  Behavior,
} from "./api/types"

// =============================================================================
// Constants
// =============================================================================

const NPC_FILES = ["grandpa"] as const
type NPCId = (typeof NPC_FILES)[number]

const BEHAVIOR_TOAST: Record<Behavior, string> = {
  friendly: "はとても協力的だ",
  neutral: "は落ち着いて話している",
  cautious: "は慎重に言葉を選んでいる",
  annoyed: "は少し不機嫌だ",
  angry: "は怒っている",
  confused: "は困惑している",
  dismissive: "は話を終わらせたそうだ",
}

// =============================================================================
// Types
// =============================================================================

interface ObtainedClue {
  id: string
  label: string
  content: string
  npcId: string
  npcName: string
}

interface DebugEntry {
  timestamp: string
  type: "request" | "response" | "error" | "info"
  data: unknown
}

interface NPCState {
  affinity: number
  turn: number
  revealedClues: string[]
}

// =============================================================================
// Component
// =============================================================================

export default function AIDialoguePage() {
  // NPC設定
  const [npcConfigs, setNpcConfigs] = useState<Record<NPCId, NPCConfig | null>>({
    grandpa: null,
  })
  const [activeNpcId, setActiveNpcId] = useState<NPCId>("grandpa")
  const [isLoadingConfig, setIsLoadingConfig] = useState(true)

  // 会話状態（NPCごとに管理）
  const [npcStates, setNpcStates] = useState<Record<NPCId, NPCState>>({
    grandpa: { affinity: 5, turn: 1, revealedClues: [] },
  })
  const [messagesMap, setMessagesMap] = useState<Record<NPCId, ChatMessage[]>>({
    grandpa: [],
  })

  // UI状態
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [obtainedClues, setObtainedClues] = useState<ObtainedClue[]>([])
  const [lastBehavior, setLastBehavior] = useState<Behavior | null>(null)

  // デバッグ
  const [showDebug, setShowDebug] = useState(true)
  const [debugLog, setDebugLog] = useState<DebugEntry[]>([])
  const [lastResponse, setLastResponse] = useState<NPCDialogueResponse | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { showAppToast } = useAppToast()

  // デバッグログ追加ヘルパー
  const addDebugLog = (type: DebugEntry["type"], data: unknown) => {
    const entry: DebugEntry = {
      timestamp: new Date().toLocaleTimeString(),
      type,
      data,
    }
    setDebugLog((prev) => [...prev.slice(-20), entry]) // 最新20件のみ保持
    console.log(`[Debug ${type}]`, data)
  }

  const activeNpc = npcConfigs[activeNpcId]
  const activeState = npcStates[activeNpcId]
  const messages = messagesMap[activeNpcId] || []

  // =========================================================================
  // Load NPC Configs
  // =========================================================================

  useEffect(() => {
    const loadConfigs = async () => {
      setIsLoadingConfig(true)
      const configs: Record<NPCId, NPCConfig | null> = { grandpa: null }
      const states: Record<NPCId, NPCState> = {
        grandpa: { affinity: 5, turn: 1, revealedClues: [] },
      }

      for (const npcId of NPC_FILES) {
        try {
          const res = await fetch(`/game/npcs/${npcId}.json`)
          if (res.ok) {
            const config: NPCConfig = await res.json()
            configs[npcId] = config
            states[npcId] = {
              affinity: config.affinity.initial,
              turn: 1,
              revealedClues: [],
            }
          }
        } catch (e) {
          console.error(`Failed to load NPC config: ${npcId}`, e)
        }
      }

      setNpcConfigs(configs)
      setNpcStates(states)
      setIsLoadingConfig(false)
    }

    loadConfigs()
  }, [])

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // =========================================================================
  // Handlers
  // =========================================================================

  const handleNpcChange = (npcId: NPCId) => {
    setActiveNpcId(npcId)
    setInput("")
    setLastBehavior(null)
    inputRef.current?.focus()
  }

  const handleReset = () => {
    if (!activeNpc) return
    setNpcStates((prev) => ({
      ...prev,
      [activeNpcId]: {
        affinity: activeNpc.affinity.initial,
        turn: 1,
        revealedClues: [],
      },
    }))
    setMessagesMap((prev) => ({
      ...prev,
      [activeNpcId]: [],
    }))
    setLastBehavior(null)
    // 該当NPCから得た手がかりを削除
    setObtainedClues((prev) => prev.filter((c) => c.npcId !== activeNpcId))
    showAppToast("会話をリセットしました", "info", "center")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || !activeNpc) return

    const userMessage: ChatMessage = { role: "user", content: input.trim() }
    const newMessages = [...messages, userMessage]

    setMessagesMap((prev) => ({ ...prev, [activeNpcId]: newMessages }))
    setInput("")
    setIsLoading(true)
    inputRef.current?.focus()

    try {
      const request: NPCDialogueRequest = {
        message: input.trim(),
        history: messages,
        affinity: activeState.affinity,
        turn: {
          current: activeState.turn,
          max: activeNpc.conversation.max_turns,
        },
        revealed_clues: activeState.revealedClues,
        npc: activeNpc,
      }

      addDebugLog("request", {
        message: request.message,
        affinity: request.affinity,
        turn: request.turn,
        revealed_clues: request.revealed_clues,
        history_length: request.history.length,
      })

      const response = await axios.post<NPCDialogueResponse>(
        "/lab/002-ai-dialogue/api",
        request
      )

      const data = response.data
      setLastResponse(data)

      // レスポンス詳細をデバッグログに記録
      addDebugLog("response", {
        impression: data.impression,
        affinity: data.affinity,
        behavior: data.behavior,
        response_text_length: data.response?.text?.length || 0,
        response_text_preview: data.response?.text?.substring(0, 50) || "(empty)",
        response_text_empty: !data.response?.text || data.response.text.trim() === "",
        clues_revealed: data.clues?.revealed || [],
        clues_withheld: data.clues?.withheld || [],
        conversation: data.conversation,
      })

      // 問題検出
      if (!data.response?.text || data.response.text.trim() === "") {
        addDebugLog("error", {
          problem: "EMPTY_RESPONSE_TEXT",
          full_response: data,
        })
      }
      if ((data.clues?.revealed?.length || 0) > 2) {
        addDebugLog("info", {
          notice: "MULTIPLE_CLUES_REVEALED",
          count: data.clues.revealed.length,
          clues: data.clues.revealed,
        })
      }

      // 状態更新
      const revealedCluesFromResponse = data.clues?.revealed || []
      setNpcStates((prev) => ({
        ...prev,
        [activeNpcId]: {
          affinity: data.affinity?.current ?? prev[activeNpcId].affinity,
          turn: prev[activeNpcId].turn + 1,
          revealedClues: [
            ...prev[activeNpcId].revealedClues,
            ...revealedCluesFromResponse,
          ],
        },
      }))

      // 振る舞い更新
      setLastBehavior(data.behavior?.type || null)

      // 新しい手がかりをチェック
      const newClues = revealedCluesFromResponse
        .map((clueId) => {
          const clueInfo = (activeNpc.clues || []).find((c) => c.id === clueId)
          if (!clueInfo) return null
          // 既に取得済みの場合はスキップ
          if (obtainedClues.some((c) => c.id === clueId)) return null
          return {
            ...clueInfo,
            npcId: activeNpcId,
            npcName: activeNpc.name,
          }
        })
        .filter((c): c is ObtainedClue => c !== null)

      // トースト表示（手がかりがあれば手がかり優先、なければ振る舞い）
      if (newClues.length > 0) {
        // 手がかり獲得トースト（振る舞いトーストを上書き）
        const clueLabels = newClues.map((c) => c.label).join("、")
        showAppToast(`「${clueLabels}」の情報を獲得！`, "success", "center")
        setObtainedClues((prev) => [...prev, ...newClues])
      } else if (data.behavior?.type) {
        // 振る舞いトースト
        const behaviorToast = activeNpc.behaviors?.[data.behavior.type]?.toast
          || `${activeNpc.name}${BEHAVIOR_TOAST[data.behavior.type] || ""}`
        showAppToast(behaviorToast, "info", "center")
      }

      // アシスタントメッセージ追加
      const responseText = data.response?.text || "..."
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: responseText,
      }
      setMessagesMap((prev) => ({
        ...prev,
        [activeNpcId]: [...newMessages, assistantMessage],
      }))

      // 会話終了判定
      if (data.conversation?.should_end) {
        showAppToast(
          data.conversation.end_reason || "会話が終了しました",
          "warning",
          "center"
        )
      }
    } catch (error) {
      console.error("API Error:", error)
      addDebugLog("error", {
        problem: "API_ERROR",
        error: axios.isAxiosError(error)
          ? {
              status: error.response?.status,
              message: error.response?.data?.error || error.message,
              stack: error.response?.data?.stack,
              fullData: error.response?.data,
            }
          : String(error),
      })
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: `[エラー] ${
          axios.isAxiosError(error)
            ? error.response?.data?.error || error.message
            : "通信エラー"
        }`,
      }
      setMessagesMap((prev) => ({
        ...prev,
        [activeNpcId]: [...newMessages, errorMessage],
      }))
    } finally {
      setIsLoading(false)
    }
  }

  // =========================================================================
  // Render
  // =========================================================================

  if (isLoadingConfig) {
    return (
      <main className="min-h-screen bg-gray-900 text-white p-4 flex items-center justify-center">
        <p className="text-gray-400">NPC設定を読み込み中...</p>
      </main>
    )
  }

  if (!activeNpc) {
    return (
      <main className="min-h-screen bg-gray-900 text-white p-4 flex items-center justify-center">
        <p className="text-red-400">NPC設定の読み込みに失敗しました</p>
      </main>
    )
  }

  const maxTurns = activeNpc.conversation.max_turns
  const remainingTurns = maxTurns ? maxTurns - activeState.turn + 1 : null

  return (
    <main className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-xl font-bold mb-2">Lab 002: AIダイアログ v2</h1>
      <p className="text-gray-400 text-sm mb-4">
        好感度・振る舞いシステムを持つNPC会話の検証
      </p>

      {/* NPC切り替えタブ */}
      <div className="flex gap-2 mb-4">
        {NPC_FILES.map((npcId) => {
          const npc = npcConfigs[npcId]
          return (
            <button
              key={npcId}
              onClick={() => handleNpcChange(npcId)}
              disabled={!npc}
              className={`px-4 py-2 rounded text-sm transition ${
                activeNpcId === npcId
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {npc?.name || npcId}
            </button>
          )
        })}
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded text-sm bg-gray-700 text-gray-300 hover:bg-red-600 ml-auto"
        >
          リセット
        </button>
      </div>

      {/* ステータス表示 */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* 好感度 */}
        <div className="bg-gray-800 border border-gray-600 rounded p-3">
          <p className="text-xs text-gray-400 mb-1">好感度</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${activeState.affinity * 10}%` }}
              />
            </div>
            <span className="text-sm font-bold">{activeState.affinity}/10</span>
          </div>
        </div>

        {/* ターン */}
        <div className="bg-gray-800 border border-gray-600 rounded p-3">
          <p className="text-xs text-gray-400 mb-1">ターン</p>
          <p className="text-lg font-bold">
            {activeState.turn}
            {maxTurns && (
              <span className="text-sm text-gray-400">/{maxTurns}</span>
            )}
          </p>
          {remainingTurns !== null && remainingTurns <= 3 && (
            <p className="text-xs text-yellow-400">残り{remainingTurns}ターン</p>
          )}
        </div>

        {/* 振る舞い */}
        <div className="bg-gray-800 border border-gray-600 rounded p-3">
          <p className="text-xs text-gray-400 mb-1">現在の態度</p>
          <p className="text-lg font-bold">
            {lastBehavior ? (
              <span
                className={
                  lastBehavior === "friendly"
                    ? "text-green-400"
                    : lastBehavior === "angry"
                      ? "text-red-400"
                      : lastBehavior === "annoyed"
                        ? "text-orange-400"
                        : "text-gray-300"
                }
              >
                {lastBehavior}
              </span>
            ) : (
              <span className="text-gray-500">-</span>
            )}
          </p>
        </div>
      </div>

      {/* NPC情報 */}
      <div className="bg-gray-800 border border-gray-600 rounded p-3 mb-3 text-sm">
        <p className="text-yellow-400 font-bold mb-1">{activeNpc.name}</p>
        <p className="text-gray-300">{activeNpc.background}</p>
      </div>

      {/* 得られた手がかり */}
      <div className="bg-gray-800 border border-gray-600 rounded p-3 mb-4 text-sm min-h-[80px]">
        <p className="text-green-400 font-bold mb-2">得られた手がかり</p>
        {obtainedClues.length === 0 ? (
          <p className="text-gray-500">
            まだ手がかりはありません。NPCから情報を引き出しましょう。
          </p>
        ) : (
          <ul className="space-y-1">
            {obtainedClues.map((clue) => (
              <li key={`${clue.npcId}-${clue.id}`} className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-gray-300">
                  <span className="text-gray-500 text-xs">[{clue.npcName}]</span>{" "}
                  <span className="font-medium">{clue.label}</span>
                  <span className="text-gray-400 ml-2">- {clue.content}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 履歴表示 */}
      <div className="border border-gray-700 rounded p-4 h-[35vh] overflow-y-auto mb-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-gray-500">メッセージを送信してください</p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded ${
              msg.role === "user" ? "bg-blue-900 ml-8" : "bg-gray-700 mr-8"
            }`}
          >
            <span className="text-xs text-gray-400 block mb-1">
              {msg.role === "user" ? "あなた" : activeNpc.name}
            </span>
            <p className="whitespace-pre-wrap">{msg.content}</p>
          </div>
        ))}
        {isLoading && (
          <div className="bg-gray-700 mr-8 p-2 rounded">
            <span className="text-xs text-gray-400 block mb-1">
              {activeNpc.name}
            </span>
            <p className="text-gray-400">考え中...</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 入力フォーム */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="メッセージを入力..."
          className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          送信
        </button>
      </form>

      {/* デバッグパネル */}
      <div className="mt-6 border-t border-gray-700 pt-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-yellow-400">Debug Panel</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setDebugLog([])}
              className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
            >
              Clear Log
            </button>
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
            >
              {showDebug ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {showDebug && (
          <div className="grid grid-cols-2 gap-4">
            {/* 左: 最後のレスポンス詳細 */}
            <div className="bg-gray-800 border border-gray-600 rounded p-3 text-xs">
              <p className="text-green-400 font-bold mb-2">Last Response</p>
              {lastResponse ? (
                <div className="space-y-2 overflow-auto max-h-[300px]">
                  <div>
                    <span className="text-gray-400">impression:</span>{" "}
                    <span className={lastResponse.impression.type === "positive" ? "text-green-400" : lastResponse.impression.type === "negative" ? "text-red-400" : "text-gray-300"}>
                      {lastResponse.impression.type}
                    </span>
                    <span className="text-gray-500 ml-2">({lastResponse.impression.reason})</span>
                  </div>
                  <div>
                    <span className="text-gray-400">affinity:</span>{" "}
                    <span className="text-blue-400">
                      {lastResponse.affinity.previous} → {lastResponse.affinity.current}
                    </span>
                    <span className="text-gray-500 ml-2">(change: {lastResponse.affinity.change >= 0 ? "+" : ""}{lastResponse.affinity.change})</span>
                  </div>
                  <div>
                    <span className="text-gray-400">behavior:</span>{" "}
                    <span className="text-purple-400">{lastResponse.behavior.type}</span>
                    <span className="text-gray-500 ml-2">({lastResponse.behavior.reason})</span>
                  </div>
                  <div>
                    <span className="text-gray-400">response.text:</span>
                    <span className={!lastResponse.response?.text ? "text-red-400 font-bold" : "text-gray-300"}>
                      {lastResponse.response?.text
                        ? ` "${lastResponse.response.text.substring(0, 100)}${lastResponse.response.text.length > 100 ? "..." : ""}"`
                        : " (EMPTY!)"}
                    </span>
                    <span className="text-gray-500 ml-2">({lastResponse.response?.text?.length || 0} chars)</span>
                  </div>
                  <div>
                    <span className="text-gray-400">internal_thought:</span>
                    <span className="text-gray-500 ml-2">
                      {lastResponse.response?.internal_thought?.substring(0, 80) || "(none)"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">clues.revealed:</span>{" "}
                    <span className={lastResponse.clues?.revealed?.length > 0 ? "text-yellow-400" : "text-gray-500"}>
                      [{lastResponse.clues?.revealed?.join(", ") || "none"}]
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">clues.withheld:</span>{" "}
                    <span className="text-gray-500">
                      [{lastResponse.clues?.withheld?.join(", ") || "none"}]
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">should_end:</span>{" "}
                    <span className={lastResponse.conversation?.should_end ? "text-red-400" : "text-gray-300"}>
                      {String(lastResponse.conversation?.should_end)}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No response yet</p>
              )}
            </div>

            {/* 右: ログ履歴 */}
            <div className="bg-gray-800 border border-gray-600 rounded p-3 text-xs">
              <p className="text-green-400 font-bold mb-2">Log History ({debugLog.length})</p>
              <div className="space-y-1 overflow-auto max-h-[300px]">
                {debugLog.length === 0 ? (
                  <p className="text-gray-500">No logs yet</p>
                ) : (
                  debugLog.slice().reverse().map((entry, i) => (
                    <div key={i} className="border-b border-gray-700 pb-1 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">{entry.timestamp}</span>
                        <span className={
                          entry.type === "error" ? "text-red-400 font-bold" :
                          entry.type === "request" ? "text-blue-400" :
                          entry.type === "response" ? "text-green-400" :
                          "text-yellow-400"
                        }>
                          [{entry.type}]
                        </span>
                      </div>
                      <pre className="text-gray-400 whitespace-pre-wrap break-all text-[10px] mt-1">
                        {JSON.stringify(entry.data, null, 2)}
                      </pre>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
