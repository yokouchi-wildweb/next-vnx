/**
 * Lab 002: AI Dialogue API (v2)
 * 汎用NPCダイアログエンジン
 * - NPC設定はリクエストで受け取る
 * - 単一ツール（npc_response）で構造化出力を強制
 */
import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import {
  NPCDialogueRequest,
  NPCDialogueResponse,
  NPCConfig,
  BEHAVIORS,
  IMPRESSIONS,
  Behavior,
} from "./types"

// =============================================================================
// Config
// =============================================================================

const API_CONFIG = {
  model: "claude-3-haiku-20240307", // claude-3-haiku-20240307, claude-sonnet-4-20250514
  maxTokens: 2048,
  debug: true,
}

// =============================================================================
// Debug Utils
// =============================================================================

function debugLog(label: string, data?: unknown) {
  if (!API_CONFIG.debug) return
  console.log(`[AI-Dialogue-v2] ${label}`)
  if (data !== undefined) {
    console.log(typeof data === "string" ? data : JSON.stringify(data, null, 2))
  }
}

function debugWarn(label: string, data?: unknown) {
  if (!API_CONFIG.debug) return
  console.warn(`[AI-Dialogue-v2] ⚠️ ${label}`)
  if (data !== undefined) {
    console.warn(typeof data === "string" ? data : JSON.stringify(data, null, 2))
  }
}

// =============================================================================
// Tool Definition
// =============================================================================

function buildTool(npc: NPCConfig): Anthropic.Tool {
  return {
    name: "npc_response",
    description: "NPCとしての応答を構造化して出力する。すべての応答でこのツールを必ず使用すること。",
    input_schema: {
      type: "object" as const,
      properties: {
        impression: {
          type: "object",
          description: "ユーザーの発言に対する印象（好感度計算用）",
          properties: {
            type: {
              type: "string",
              enum: IMPRESSIONS,
              description: "印象タイプ",
            },
            reason: {
              type: "string",
              description: "この印象を持った理由（短く）",
            },
          },
          required: ["type", "reason"],
        },
        affinity: {
          type: "object",
          description: "好感度の計算結果",
          properties: {
            previous: {
              type: "number",
              description: "変化前の好感度",
            },
            change: {
              type: "number",
              minimum: -2,
              maximum: 2,
              description: "好感度の変化量（-2〜+2）",
            },
            current: {
              type: "number",
              description: "変化後の好感度（1〜10の範囲に収める）",
            },
          },
          required: ["previous", "change", "current"],
        },
        behavior: {
          type: "object",
          description: "このターンでの振る舞い",
          properties: {
            type: {
              type: "string",
              enum: BEHAVIORS,
              description: "振る舞いタイプ",
            },
            reason: {
              type: "string",
              description: "この振る舞いを選んだ理由（短く）",
            },
          },
          required: ["type", "reason"],
        },
        response: {
          type: "object",
          description: "NPCの応答",
          properties: {
            text: {
              type: "string",
              description: "NPCのセリフ（ユーザーに表示される）",
            },
            internal_thought: {
              type: "string",
              description: "NPCの内心（デバッグ用、ユーザーには見せない）",
            },
          },
          required: ["text", "internal_thought"],
        },
        clues: {
          type: "object",
          description: "手がかりの開示判定",
          properties: {
            revealed: {
              type: "array",
              items: { type: "string" },
              description: "このターンで開示する手がかりのID",
            },
            withheld: {
              type: "array",
              items: { type: "string" },
              description: "検討したが開示しなかった手がかりのID",
            },
          },
          required: ["revealed", "withheld"],
        },
        conversation: {
          type: "object",
          description: "会話の継続状態",
          properties: {
            should_end: {
              type: "boolean",
              description: "会話を終了すべきか",
            },
            end_reason: {
              type: "string",
              description: "終了理由（should_endがtrueの場合）",
            },
          },
          required: ["should_end"],
        },
      },
      required: ["impression", "affinity", "behavior", "response", "clues", "conversation"],
    },
  }
}

// =============================================================================
// System Prompt Builder
// =============================================================================

function buildSystemPrompt(
  npc: NPCConfig,
  affinity: number,
  turn: { current: number; max: number | null },
  revealedClues: string[]
): string {
  // 振る舞い設定をフォーマット
  const behaviorsText = Object.entries(npc.behaviors || {})
    .map(([type, config]) => {
      if (!config) return ""
      const conditions = Array.isArray(config.conditions) ? config.conditions.join("、") : ""
      const range = Array.isArray(config.affinity_range) ? `${config.affinity_range[0]}〜${config.affinity_range[1]}` : "未設定"
      return `### ${type}
- 条件: ${conditions}
- 好感度レンジ: ${range}
- 方針: ${config.guideline || ""}`
    })
    .filter(Boolean)
    .join("\n\n")

  // 手がかり開示条件をフォーマット
  const cluesText = (npc.clues || [])
    .map((clue) => {
      const condition = npc.clue_conditions?.[clue.id]
      const isRevealed = (revealedClues || []).includes(clue.id)
      if (isRevealed) {
        return `- ${clue.id}: ${clue.label}【開示済み】`
      }
      const affReq = condition?.affinity
      let reqText = ""
      if (affReq?.min !== undefined) reqText = `好感度${affReq.min}以上`
      else if (affReq?.max !== undefined) reqText = `好感度${affReq.max}以下`
      else if (affReq?.range) reqText = `好感度${affReq.range[0]}〜${affReq.range[1]}`
      if (condition?.required_clues?.length) {
        reqText += `、前提: ${condition.required_clues.join(",")}`
      }
      if (condition?.required_context) {
        reqText += `、文脈: ${condition.required_context}`
      }
      return `- ${clue.id}: ${clue.label}（${reqText || "条件なし"}）→ 内容:「${clue.content}」`
    })
    .join("\n")

  // ターン情報
  let turnText = `現在 ${turn.current} ターン目`
  if (turn.max) {
    const remaining = turn.max - turn.current
    turnText += `（残り ${remaining} ターン）`
    const turnBehavior = npc.conversation?.turn_behavior
    if (remaining <= Math.floor(turn.max * 0.25) && turnBehavior?.late) {
      turnText += `\n※終盤です: ${turnBehavior.late}`
    } else if (remaining === 0 && turnBehavior?.final) {
      turnText += `\n※最終ターンです: ${turnBehavior.final}`
    }
  }

  // プレイヤーとの関係
  const playerRelation = npc.player_relation
  const relationText = playerRelation
    ? `## プレイヤーとの関係
- 相手: ${playerRelation.relationship}
- 現在の状況: ${playerRelation.context}
- あなたの第一印象: ${playerRelation.initial_impression}`
    : ""

  return `あなたは「${npc.name}」としてロールプレイしてください。

## キャラクター情報
- 名前: ${npc.name}
- 年齢: ${npc.age}歳
- 職業: ${npc.occupation}
- 背景: ${npc.background}

${relationText}

## 性格
${(npc.personality || []).map((p) => `- ${p}`).join("\n")}

## 口調・話し方
${(npc.speechStyle || []).map((s) => `- ${s}`).join("\n")}

## 知っている情報
${(npc.knowledge || []).map((k) => `- ${k}`).join("\n")}

---

## 現在の状態
- 好感度: ${affinity}/10
- ${turnText}

---

## あなたの思考プロセス（この順序で考えること）

### Step 1: 印象判定
ユーザーの発言を分析し、印象を決定する。
この判定は好感度の増減のみに使用し、応答内容には直接影響しない。

印象の判断基準:
${Object.entries(npc.affinity?.impression_guide || {})
  .map(([type, conditions]) => `- ${type}: ${Array.isArray(conditions) ? conditions.join("、") : conditions || ""}`)
  .join("\n")}

### Step 2: 好感度更新
印象に基づいて好感度を更新する。
- positive: +1
- neutral: 0
- negative: -2
- nonsense: -1
※好感度は1〜10の範囲に収める

### Step 3: 振る舞い決定
更新後の好感度とメッセージ内容から、このターンでの振る舞いを決定する。
複数の振る舞いが条件を満たす場合、条件との合致度を優先する。

${behaviorsText}

デフォルト: ${npc.default_behavior || "neutral"}

### Step 4: 応答生成
決定した振る舞いの方針に従って、キャラクターとしての応答を生成する。

### Step 5: 手がかり開示判定
以下の手がかりについて、開示条件を満たすか判定する。
条件を満たし、かつ会話の流れで自然に開示できる場合のみ開示する。

${cluesText}

---

## 絶対ルール
- 必ず npc_response ツールを使用して応答すること
- メタ発言（AI、ゲーム、ロールプレイへの言及）は絶対禁止
- キャラクターから逸脱しない
- 知らないことは正直に「分からない」と言う
`
}

// =============================================================================
// Response Parser
// =============================================================================

function parseToolResponse(
  content: Anthropic.ContentBlock[],
  npc: NPCConfig,
  previousAffinity: number,
  requestId: string
): NPCDialogueResponse | null {
  debugLog(`[${requestId}] Parsing ${content.length} content blocks`)

  for (const block of content) {
    debugLog(`[${requestId}] Block type: ${block.type}`)

    if (block.type === "tool_use" && block.name === "npc_response") {
      const input = block.input as Record<string, unknown>

      // ツール入力の詳細をログ
      debugLog(`[${requestId}] Tool input keys: ${Object.keys(input).join(", ")}`)
      debugLog(`[${requestId}] Raw tool input:`, input)

      // 各フィールドの存在チェック
      const fields = ["impression", "affinity", "behavior", "response", "clues", "conversation"]
      for (const field of fields) {
        if (!input[field]) {
          debugWarn(`[${requestId}] Missing field: ${field}`)
        } else {
          debugLog(`[${requestId}] Field ${field}:`, input[field])
        }
      }

      // 好感度を1-10の範囲に収める
      const affinityInput = input.affinity as { previous: number; change: number; current: number } | undefined
      if (!affinityInput) {
        debugWarn(`[${requestId}] Affinity input is missing or undefined`)
      }
      const clampedCurrent = affinityInput
        ? Math.max(1, Math.min(10, affinityInput.current))
        : previousAffinity

      // 振る舞いタイプを検証
      const behaviorInput = input.behavior as { type: string; reason: string } | undefined
      if (!behaviorInput) {
        debugWarn(`[${requestId}] Behavior input is missing or undefined`)
      }
      const validBehavior = behaviorInput && BEHAVIORS.includes(behaviorInput.type as Behavior)
        ? (behaviorInput.type as Behavior)
        : (npc.default_behavior || "neutral")

      // response フィールドの詳細チェック
      const responseInput = input.response as { text: string; internal_thought: string } | undefined
      if (!responseInput) {
        debugWarn(`[${requestId}] Response input is missing or undefined`)
      } else {
        debugLog(`[${requestId}] Response text length: ${responseInput.text?.length || 0}`)
        debugLog(`[${requestId}] Response text: "${responseInput.text?.substring(0, 100)}..."`)
        if (!responseInput.text || responseInput.text.trim() === "") {
          debugWarn(`[${requestId}] Response text is EMPTY!`)
        }
      }

      // clues フィールドの詳細チェック
      const cluesInput = input.clues as { revealed: string[]; withheld: string[] } | undefined
      if (!cluesInput) {
        debugWarn(`[${requestId}] Clues input is missing or undefined`)
      } else {
        debugLog(`[${requestId}] Clues revealed: ${cluesInput.revealed?.length || 0} items: [${cluesInput.revealed?.join(", ")}]`)
        debugLog(`[${requestId}] Clues withheld: ${cluesInput.withheld?.length || 0} items: [${cluesInput.withheld?.join(", ")}]`)
      }

      const result: NPCDialogueResponse = {
        impression: input.impression as NPCDialogueResponse["impression"] || { type: "neutral", reason: "missing" },
        affinity: {
          previous: previousAffinity,
          change: affinityInput?.change || 0,
          current: clampedCurrent,
        },
        behavior: {
          type: validBehavior,
          reason: behaviorInput?.reason || "missing",
        },
        response: responseInput || { text: "", internal_thought: "missing" },
        clues: cluesInput || { revealed: [], withheld: [] },
        conversation: input.conversation as NPCDialogueResponse["conversation"] || { should_end: false },
      }

      debugLog(`[${requestId}] Final parsed result:`, result)
      return result
    }
  }
  return null
}

// =============================================================================
// API Handler
// =============================================================================

export async function POST(request: NextRequest) {
  const requestId = Date.now().toString(36)

  try {
    const body: NPCDialogueRequest = await request.json()
    const { message, history, affinity, turn, revealed_clues, npc } = body

    // ========== Validation ==========
    debugLog(`[${requestId}] ===== New Request =====`)
    debugLog(`[${requestId}] NPC: ${npc?.name}`)
    debugLog(`[${requestId}] Message: ${message?.substring(0, 50)}...`)
    debugLog(`[${requestId}] Affinity: ${affinity}, Turn: ${turn?.current}/${turn?.max}`)

    if (!message?.trim()) {
      return NextResponse.json({ error: "メッセージが必要です" }, { status: 400 })
    }
    if (!npc) {
      return NextResponse.json({ error: "NPC設定が必要です" }, { status: 400 })
    }

    // ========== Build Request ==========
    const client = new Anthropic()
    const systemPrompt = buildSystemPrompt(npc, affinity, turn, revealed_clues)
    const tool = buildTool(npc)

    // 会話履歴を構築
    const messages: Anthropic.MessageParam[] = [
      ...history.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user" as const, content: message },
    ]

    debugLog(`[${requestId}] System prompt length: ${systemPrompt.length}`)
    debugLog(`[${requestId}] History length: ${history.length}`)

    // ========== Call Claude API ==========
    const startTime = Date.now()
    const response = await client.messages.create({
      model: API_CONFIG.model,
      max_tokens: API_CONFIG.maxTokens,
      system: systemPrompt,
      messages,
      tools: [tool],
      tool_choice: { type: "tool", name: "npc_response" }, // ツール使用を強制
    })
    const elapsed = Date.now() - startTime

    debugLog(`[${requestId}] Response received (${elapsed}ms)`)
    debugLog(`[${requestId}] Stop reason: ${response.stop_reason}`)

    // ========== Parse Response ==========
    debugLog(`[${requestId}] Raw API response:`, {
      stop_reason: response.stop_reason,
      usage: response.usage,
      content_length: response.content.length,
    })

    const parsed = parseToolResponse(response.content, npc, affinity, requestId)

    if (!parsed) {
      debugWarn(`[${requestId}] Failed to parse tool response`)
      debugWarn(`[${requestId}] Raw content:`, response.content)

      // フォールバック応答
      return NextResponse.json({
        impression: { type: "neutral", reason: "解析エラー" },
        affinity: { previous: affinity, change: 0, current: affinity },
        behavior: { type: npc.default_behavior || "neutral", reason: "解析エラーによるデフォルト" },
        response: { text: "...", internal_thought: "応答の解析に失敗" },
        clues: { revealed: [], withheld: [] },
        conversation: { should_end: false },
      } satisfies NPCDialogueResponse)
    }

    debugLog(`[${requestId}] ===== Parsed Response =====`)
    debugLog(`[${requestId}] Impression: ${parsed.impression?.type}`)
    debugLog(`[${requestId}] Affinity: ${parsed.affinity?.previous} → ${parsed.affinity?.current}`)
    debugLog(`[${requestId}] Behavior: ${parsed.behavior?.type}`)
    debugLog(`[${requestId}] Clues revealed: ${(parsed.clues?.revealed || []).join(", ") || "none"}`)

    return NextResponse.json(parsed)
  } catch (error) {
    debugWarn(`[${requestId}] Error:`, error)
    console.error("Claude API error:", error)
    if (error instanceof Error) {
      console.error("Stack trace:", error.stack)
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "AIとの通信に失敗しました",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}
