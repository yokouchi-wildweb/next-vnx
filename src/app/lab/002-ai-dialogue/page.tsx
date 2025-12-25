/**
 * Lab 002: AIダイアログ
 *
 * 目的: LLMのAIによる動的な文章の受け答えを模索
 * UIは最小限。API連携のテストが主目的。
 */
"use client"

import { useState, useRef } from "react"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function AIDialoguePage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: "user", content: input.trim() }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    inputRef.current?.focus()

    // TODO: API連携
    // 仮のダミー応答
    setTimeout(() => {
      const assistantMessage: Message = {
        role: "assistant",
        content: `[ダミー応答] 「${userMessage.content}」に対する返答 / まだ未実装なので会話はできません。`,
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 500)
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-xl font-bold mb-2">Lab 002: AIダイアログ</h1>
      <p className="text-gray-400 text-sm mb-4">
        AIがあなたのメッセージを読み取り、その場で考えて返答します。
        台本にない、毎回異なる会話が生まれます。
      </p>

      {/* 履歴表示 */}
      <div className="border border-gray-700 rounded p-4 h-[60vh] overflow-y-auto mb-4 space-y-3">
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
              {msg.role === "user" ? "あなた" : "AI"}
            </span>
            <p className="whitespace-pre-wrap">{msg.content}</p>
          </div>
        ))}
        {isLoading && (
          <div className="bg-gray-700 mr-8 p-2 rounded">
            <span className="text-xs text-gray-400 block mb-1">AI</span>
            <p className="text-gray-400">考え中...</p>
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
