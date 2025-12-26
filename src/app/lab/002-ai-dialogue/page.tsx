/**
 * Lab 002: AIダイアログ
 *
 * 目的: LLMのAIによる動的な文章の受け答えを模索
 * UIは最小限。API連携のテストが主目的。
 */
"use client"

import { useState, useRef } from "react"
import axios from "axios"
import { useAppToast } from "@/hooks/useAppToast"

// ============================================================
// NPC定義（UI表示用）
// ============================================================

const NPC_LIST = [
  {
    id: "grandpa",
    name: "田中義男",
    description: "散歩中のおじいちゃん（目撃者）",
    situation: "あなたは探偵。昨日この公園で事件が起きた。目の前にいる散歩中のおじいちゃん（田中義男さん、78歳）から目撃情報を聞き出そう。",
  },
  {
    id: "friend",
    name: "山田健太",
    description: "被害者の親友",
    situation: "あなたは探偵。被害者・鈴木翔太（28歳）の親友である山田健太（32歳）から話を聞いている。カフェで向かい合い、被害者の最近の様子や人間関係について聞き出そう。",
  },
  {
    id: "suspicious",
    name: "佐藤隆",
    description: "怪しい男（容疑者候補）",
    situation: "あなたは探偵。事件当日、公園付近をウロウロしていた不審な男・佐藤隆（45歳）から話を聞いている。態度が妙に 保守的 だが、本当に犯人なのか？真実を引き出せ。",
  },
] as const

type NPCId = (typeof NPC_LIST)[number]["id"]

// ============================================================
// 型定義
// ============================================================

interface Message {
  role: "user" | "assistant"
  content: string
}

interface ClueInfo {
  id: string
  label: string
}

interface ObtainedClue extends ClueInfo {
  npcId: string
  npcName: string
}

// ============================================================
// コンポーネント
// ============================================================

export default function AIDialoguePage() {
  const [activeNpcId, setActiveNpcId] = useState<NPCId>("grandpa")
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [obtainedClues, setObtainedClues] = useState<ObtainedClue[]>([])
  const [cluesMap, setCluesMap] = useState<Record<string, ClueInfo[]>>({})
  const inputRef = useRef<HTMLInputElement>(null)
  const { showAppToast } = useAppToast()

  const activeNpc = NPC_LIST.find((npc) => npc.id === activeNpcId)!

  // NPC切り替え
  const handleNpcChange = (npcId: NPCId) => {
    setActiveNpcId(npcId)
    setMessages([]) // 会話履歴をリセット
    setInput("")
    inputRef.current?.focus()
    // 注意: obtainedCluesはリセットしない（全体で蓄積）
  }

  // メッセージ送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: "user", content: input.trim() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)
    inputRef.current?.focus()

    try {
      const response = await axios.post("/api/lab/ai-dialogue", {
        messages: newMessages,
        npcId: activeNpcId,
      })

      const { content, revealedClues, clues } = response.data as {
        content: string
        revealedClues: string[]
        clues: ClueInfo[]
      }

      // cluesMapを更新
      if (clues && !cluesMap[activeNpcId]) {
        setCluesMap((prev) => ({ ...prev, [activeNpcId]: clues }))
      }

      // 新しく得られた手がかりを検出
      const existingClueIds = new Set(obtainedClues.map((c) => c.id))
      const newClueIds = revealedClues.filter((id) => !existingClueIds.has(id))

      if (newClueIds.length > 0 && clues) {
        const newClues = newClueIds
          .map((id) => {
            const clueInfo = clues.find((c) => c.id === id)
            if (!clueInfo) return null
            return {
              ...clueInfo,
              npcId: activeNpcId,
              npcName: activeNpc.name,
            } as ObtainedClue
          })
          .filter((c): c is ObtainedClue => c !== null)

        // トースト表示（中央）
        for (const clue of newClues) {
          showAppToast(`🔍 「${clue.label}」の情報を獲得！`, "success", "center")
        }

        setObtainedClues((prev) => [...prev, ...newClues])
      }

      const assistantMessage: Message = {
        role: "assistant",
        content,
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: `[エラー] ${axios.isAxiosError(error) ? error.response?.data?.error || error.message : "通信エラー"}`,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-xl font-bold mb-2">Lab 002: AIダイアログ</h1>
      <p className="text-gray-400 text-sm mb-4">
        AIがあなたのメッセージを読み取り、その場で考えて返答します。
      </p>

      {/* NPC切り替えタブ */}
      <div className="flex gap-2 mb-4">
        {NPC_LIST.map((npc) => (
          <button
            key={npc.id}
            onClick={() => handleNpcChange(npc.id)}
            className={`px-4 py-2 rounded text-sm transition ${
              activeNpcId === npc.id
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {npc.name}
          </button>
        ))}
      </div>

      {/* シチュエーション表示 */}
      <div className="bg-gray-800 border border-gray-600 rounded p-3 mb-3 text-sm">
        <p className="text-yellow-400 font-bold mb-1">シチュエーション</p>
        <p className="text-gray-300">{activeNpc.situation}</p>
      </div>

      {/* 得られた手がかり */}
      <div className="bg-gray-800 border border-gray-600 rounded p-3 mb-4 text-sm min-h-[100px]">
        <p className="text-green-400 font-bold mb-2">🔍 得られた手がかり</p>
        {obtainedClues.length === 0 ? (
          <p className="text-gray-500">まだ手がかりはありません。NPCから情報を引き出しましょう。</p>
        ) : (
          <ul className="space-y-1">
            {obtainedClues.map((clue) => (
              <li key={clue.id} className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-gray-300">
                  <span className="text-gray-500 text-xs">[{clue.npcName}]</span>{" "}
                  {clue.label}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 履歴表示 */}
      <div className="border border-gray-700 rounded p-4 h-[40vh] overflow-y-auto mb-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-gray-500">メッセージを送信してください</p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded ${
              msg.role === "user"
                ? "bg-blue-900 ml-8"
                : "bg-gray-700 mr-8"
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
            <span className="text-xs text-gray-400 block mb-1">{activeNpc.name}</span>
            <p className="text-gray-400">...</p>
          </div>
        )}
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
    </main>
  )
}
