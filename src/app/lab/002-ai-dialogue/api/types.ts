// =============================================================================
// Lab002: AI Dialogue - Type Definitions
// =============================================================================

// -----------------------------------------------------------------------------
// Enums
// -----------------------------------------------------------------------------

/** 印象タイプ（好感度変化専用） */
export const IMPRESSIONS = ["positive", "neutral", "negative", "nonsense"] as const
export type Impression = (typeof IMPRESSIONS)[number]

/** 印象による好感度変化量 */
export const IMPRESSION_EFFECTS: Record<Impression, number> = {
  positive: 1,
  neutral: 0,
  negative: -2,
  nonsense: -1,
}

/** 振る舞いタイプ（全NPC共通） */
export const BEHAVIORS = [
  "friendly",
  "neutral",
  "cautious",
  "annoyed",
  "angry",
  "confused",
  "dismissive",
] as const
export type Behavior = (typeof BEHAVIORS)[number]

// -----------------------------------------------------------------------------
// NPC Config
// -----------------------------------------------------------------------------

/** 振る舞い設定 */
export interface BehaviorConfig {
  conditions: string[]
  affinity_range: [number, number]
  guideline: string
  toast: string
}

/** 好感度条件 */
export interface AffinityCondition {
  min?: number
  max?: number
  range?: [number, number]
}

/** 手がかり開示条件 */
export interface ClueCondition {
  affinity: AffinityCondition
  required_context?: string
  required_clues?: string[]
}

/** 手がかり */
export interface Clue {
  id: string
  label: string
  content: string
}

/** ターン数に応じた振る舞い */
export interface TurnBehavior {
  early: string
  middle: string
  late: string
  final: string
}

/** 会話設定 */
export interface ConversationConfig {
  max_turns: number | null
  turn_behavior: TurnBehavior
}

/** 印象判定ガイドライン */
export interface ImpressionGuide {
  positive: string[]
  negative: string[]
  neutral: string[]
  nonsense: string[]
}

/** 好感度設定 */
export interface AffinityConfig {
  initial: number
  impression_guide: ImpressionGuide
}

/** プレイヤーとの関係設定 */
export interface PlayerRelation {
  relationship: string        // プレイヤーとの関係（初対面の探偵、知り合い等）
  initial_impression: string  // 会話開始時点でのNPCの心理・印象
  context: string             // この会話が始まった状況
}

/** NPC設定 */
export interface NPCConfig {
  id: string
  name: string
  age: number
  occupation: string
  personality: string[]
  speechStyle: string[]
  background: string
  knowledge: string[]

  player_relation: PlayerRelation

  affinity: AffinityConfig
  behaviors: Partial<Record<Behavior, BehaviorConfig>>
  default_behavior: Behavior

  clues: Clue[]
  clue_conditions: Record<string, ClueCondition>

  conversation: ConversationConfig
}

// -----------------------------------------------------------------------------
// Chat
// -----------------------------------------------------------------------------

/** チャットメッセージ */
export interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

/** ターン情報 */
export interface TurnInfo {
  current: number
  max: number | null
}

// -----------------------------------------------------------------------------
// API Request / Response
// -----------------------------------------------------------------------------

/** リクエスト */
export interface NPCDialogueRequest {
  message: string
  history: ChatMessage[]
  affinity: number
  turn: TurnInfo
  revealed_clues: string[]
  npc: NPCConfig
}

/** 印象結果 */
export interface ImpressionResult {
  type: Impression
  reason: string
}

/** 好感度結果 */
export interface AffinityResult {
  previous: number
  change: number
  current: number
}

/** 振る舞い結果 */
export interface BehaviorResult {
  type: Behavior
  reason: string
}

/** 応答結果 */
export interface ResponseResult {
  text: string
  internal_thought: string
}

/** 手がかり結果 */
export interface CluesResult {
  revealed: string[]
  withheld: string[]
}

/** 会話状態 */
export interface ConversationState {
  should_end: boolean
  end_reason?: string
}

/** レスポンス */
export interface NPCDialogueResponse {
  impression: ImpressionResult
  affinity: AffinityResult
  behavior: BehaviorResult
  response: ResponseResult
  clues: CluesResult
  conversation: ConversationState
}

// -----------------------------------------------------------------------------
// Claude Tool Schema
// -----------------------------------------------------------------------------

/** Claude APIツール入力（npc_response） */
export interface NPCResponseToolInput {
  impression: ImpressionResult
  affinity: AffinityResult
  behavior: BehaviorResult
  response: ResponseResult
  clues: CluesResult
  conversation: ConversationState
}
