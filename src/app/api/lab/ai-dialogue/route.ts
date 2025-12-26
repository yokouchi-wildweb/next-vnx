/**
 * Lab 002: AIダイアログ API
 * Claude APIと接続してチャット応答を返す
 * Tool Useで手がかり開示を明示的に制御
 */
import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { NPCConfig } from "./types"
import { NPC_MAP } from "./npcs"

// ============================================================
// API設定
// ============================================================

const API_CONFIG = {
  model: "claude-3-haiku-20240307",  // claude-3-haiku-20240307, claude-sonnet-4-20250514, claude-opus-4-20250514
  maxTokens: 1024,
  defaultNpcId: "grandpa",
  debug: true,  // デバッグログを有効化
}

// ============================================================
// デバッグユーティリティ
// ============================================================

function debugLog(label: string, data?: unknown) {
  if (!API_CONFIG.debug) return
  console.log(`[AI-Dialogue] ${label}`)
  if (data !== undefined) {
    console.log(typeof data === "string" ? data : JSON.stringify(data, null, 2))
  }
}

function debugWarn(label: string, data?: unknown) {
  if (!API_CONFIG.debug) return
  console.warn(`[AI-Dialogue] ⚠️ ${label}`)
  if (data !== undefined) {
    console.warn(typeof data === "string" ? data : JSON.stringify(data, null, 2))
  }
}

// ============================================================
// ツール定義
// ============================================================

/**
 * NPCが持つ手がかりに基づいてツール定義を生成
 */
function buildTools(npc: NPCConfig): Anthropic.Tool[] {
  return [
    {
      name: "reveal_clue",
      description: "プレイヤーの質問に答えて重要な情報を開示する際に呼び出す。情報を話す時は必ずこのツールを使用すること。",
      input_schema: {
        type: "object" as const,
        properties: {
          clue_id: {
            type: "string",
            enum: npc.clues.map((c) => c.id),
            description: "開示する情報のID",
          },
        },
        required: ["clue_id"],
      },
    },
  ]
}

// ============================================================
// システムプロンプト生成
// ============================================================

function buildSystemPrompt(npc: NPCConfig): string {
  const cluesList = npc.clues
    .map((c) => `- ${c.id}: ${c.label}`)
    .join("\n")

  return `あなたは「${npc.name}」というキャラクターをロールプレイしてください。

## 基本情報
- 名前: ${npc.name}
- 年齢: ${npc.age}歳
- 職業: ${npc.occupation}

## 性格
${npc.personality.map((p) => `- ${p}`).join("\n")}

## 口調・話し方
${npc.speechStyle.map((s) => `- ${s}`).join("\n")}

## このキャラクターの目的
${npc.goal}

## 知っている情報（質問されたら答えられる）
${npc.knowledge.map((k) => `- ${k}`).join("\n")}

## 知らない・答えられないこと
${npc.restrictions.map((r) => `- ${r}`).join("\n")}
${npc.additionalPrompt || ""}

## 絶対的なルール
- メタ的な発言（AIであること、ゲームであること）は絶対にしない
- 知らないことは「分からん」「見とらん」と正直に言う
- キャラクターから絶対に逸脱しない

## 情報開示のルール（重要）
以下の重要情報を話す際は、必ず reveal_clue ツールを呼び出してください。
通常の会話（挨拶、雑談、知らないと答える場合など）ではツールを呼び出さないでください。

利用可能な情報ID:
${cluesList}

## 応答形式のルール（絶対厳守）
- ツールを呼び出す場合でも、必ず同時にキャラクターとしてのセリフ（テキスト）を返すこと
- ツールのみで応答を終えることは禁止
- 必ず「テキスト + ツール呼び出し」または「テキストのみ」の形式で応答すること
`
}

// ============================================================
// API Handler
// ============================================================

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

interface RequestBody {
  messages: ChatMessage[]
  npcId?: string
}

export async function POST(request: NextRequest) {
  const requestId = Date.now().toString(36)  // リクエスト識別子

  try {
    const body: RequestBody = await request.json()
    const { messages, npcId = API_CONFIG.defaultNpcId } = body

    // ========== リクエスト情報 ==========
    debugLog(`[${requestId}] ===== 新規リクエスト =====`)
    debugLog(`[${requestId}] NPC: ${npcId}`)
    debugLog(`[${requestId}] メッセージ数: ${messages?.length ?? 0}`)
    debugLog(`[${requestId}] 最新メッセージ:`, messages?.[messages.length - 1])

    if (!messages || messages.length === 0) {
      debugWarn(`[${requestId}] メッセージが空`)
      return NextResponse.json(
        { error: "メッセージが必要です" },
        { status: 400 }
      )
    }

    const npc = NPC_MAP[npcId]
    if (!npc) {
      debugWarn(`[${requestId}] NPCが見つからない: ${npcId}`)
      return NextResponse.json(
        { error: `NPC "${npcId}" が見つかりません` },
        { status: 400 }
      )
    }

    debugLog(`[${requestId}] NPC名: ${npc.name}`)
    debugLog(`[${requestId}] 利用可能な手がかり:`, npc.clues.map(c => c.id))

    const client = new Anthropic()
    const systemPrompt = buildSystemPrompt(npc)
    const tools = buildTools(npc)

    debugLog(`[${requestId}] モデル: ${API_CONFIG.model}`)
    debugLog(`[${requestId}] システムプロンプト長: ${systemPrompt.length}文字`)

    // ========== API呼び出し ==========
    const startTime = Date.now()
    const response = await client.messages.create({
      model: API_CONFIG.model,
      max_tokens: API_CONFIG.maxTokens,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      tools,
    })
    const elapsed = Date.now() - startTime

    // ========== レスポンス解析 ==========
    debugLog(`[${requestId}] ===== AIレスポンス (${elapsed}ms) =====`)
    debugLog(`[${requestId}] stop_reason: ${response.stop_reason}`)
    debugLog(`[${requestId}] usage:`, response.usage)
    debugLog(`[${requestId}] content blocks: ${response.content.length}個`)

    // 各ブロックの詳細
    response.content.forEach((block, i) => {
      if (block.type === "text") {
        debugLog(`[${requestId}] block[${i}] type=text, length=${block.text.length}`)
        debugLog(`[${requestId}] block[${i}] text: "${block.text.substring(0, 100)}${block.text.length > 100 ? '...' : ''}"`)
      } else if (block.type === "tool_use") {
        debugLog(`[${requestId}] block[${i}] type=tool_use, name=${block.name}`, block.input)
      } else {
        debugLog(`[${requestId}] block[${i}] type=${(block as { type: string }).type}`)
      }
    })

    // レスポンス解析: テキストとツール呼び出しを分離
    let text = ""
    const revealedClues: string[] = []

    for (const block of response.content) {
      if (block.type === "text") {
        text += block.text
      } else if (block.type === "tool_use" && block.name === "reveal_clue") {
        const input = block.input as { clue_id: string }
        if (input.clue_id && !revealedClues.includes(input.clue_id)) {
          revealedClues.push(input.clue_id)
        }
      }
    }

    // ========== 結果サマリー ==========
    debugLog(`[${requestId}] ===== 解析結果 =====`)
    debugLog(`[${requestId}] テキスト長: ${text.length}文字`)
    debugLog(`[${requestId}] 開示された手がかり:`, revealedClues)

    // テキストが空の場合の警告と対処
    if (!text.trim()) {
      debugWarn(`[${requestId}] テキストが空！stop_reason=${response.stop_reason}`)
      debugWarn(`[${requestId}] 生content:`, response.content)
      text = "..."
    }

    const result = {
      content: text,
      revealedClues,
      clues: npc.clues.map((c) => ({ id: c.id, label: c.label })),
    }
    debugLog(`[${requestId}] 最終レスポンス:`, { content: text.substring(0, 50) + "...", revealedClues })

    return NextResponse.json(result)
  } catch (error) {
    debugWarn(`[${requestId}] エラー発生:`, error)
    console.error("Claude API error:", error)

    let errorMessage = "AIとの通信に失敗しました"
    if (error instanceof Error) {
      errorMessage = `${error.name}: ${error.message}`
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
