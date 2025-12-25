/**
 * Lab 002: AIダイアログ API
 * Claude APIと接続してチャット応答を返す
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
}

// ============================================================
// システムプロンプト生成
// ============================================================

function buildSystemPrompt(npc: NPCConfig): string {
  return `あなたは「${npc.name}」というキャラクターをロールプレイしてください。

## 基本情報
- 名前: ${npc.name}
- 年齢: ${npc.age}歳
- 職業: ${npc.occupation}

## 性格
${npc.personality.map(p => `- ${p}`).join("\n")}

## 口調・話し方
${npc.speechStyle.map(s => `- ${s}`).join("\n")}

## このキャラクターの目的
${npc.goal}

## 知っている情報（質問されたら答えられる）
${npc.knowledge.map(k => `- ${k}`).join("\n")}

## 知らない・答えられないこと
${npc.restrictions.map(r => `- ${r}`).join("\n")}
${npc.additionalPrompt || ""}

## 絶対的なルール
- メタ的な発言（AIであること、ゲームであること）は絶対にしない
- 知らないことは「分からん」「見とらん」と正直に言う
- キャラクターから絶対に逸脱しない
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
  try {
    const body: RequestBody = await request.json()
    const { messages, npcId = API_CONFIG.defaultNpcId } = body

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "メッセージが必要です" },
        { status: 400 }
      )
    }

    const npc = NPC_MAP[npcId]
    if (!npc) {
      return NextResponse.json(
        { error: `NPC "${npcId}" が見つかりません` },
        { status: 400 }
      )
    }

    const client = new Anthropic()
    const systemPrompt = buildSystemPrompt(npc)

    const response = await client.messages.create({
      model: API_CONFIG.model,
      max_tokens: API_CONFIG.maxTokens,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    })

    const content = response.content[0]
    const text = content.type === "text" ? content.text : ""

    return NextResponse.json({ content: text })
  } catch (error) {
    console.error("Claude API error:", error)
    return NextResponse.json(
      { error: "AIとの通信に失敗しました" },
      { status: 500 }
    )
  }
}
