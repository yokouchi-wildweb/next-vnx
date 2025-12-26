# Lab002: AI Dialogue

purpose: LLM NPC会話システム（推理ゲーム証言収集）
status: design phase
approach: AI-first（ルールベース最小限、プロンプトエンジニアリング重視）

## architecture

```
API = 汎用エンジン（NPC非依存）
NPC設定 = クライアント側で管理 → リクエストに含めて送信
```

benefits:
- NPC追加時にAPI修正不要
- ゲームごとに異なるNPC定義可能
- 将来のDB化が容易

## flow (6-step)

```
[Input]
├─ message: string
├─ history: ChatMessage[]
├─ affinity: number
├─ turn: { current, max }
├─ revealed_clues: string[]
└─ npc: NPCConfig

    ↓ Step 1: 印象判定（好感度計算専用）

[Impression]
├─ positive: +1
├─ neutral: 0
├─ negative: -2
└─ nonsense: -1

    ↓ Step 2: 好感度更新

[Affinity] = previous + change

    ↓ Step 3: 振る舞い決定

[Behavior] ← (affinity, message, npc.behaviors)

    ↓ Step 4: 返答生成

[Response] ← behavior.guideline + npc personality

    ↓ Step 5: 情報開示判定

[Clues] ← (behavior, affinity, message, response, clue_conditions)

    ↓ Step 6: 出力

[Output]
├─ response_text
├─ behavior (トースト表示用)
├─ affinity: { previous, change, current }
├─ revealed_clues[]
└─ conversation_state
```

## types

### Impression (好感度変化専用)

```typescript
type Impression = "positive" | "neutral" | "negative" | "nonsense"

impression_effects: {
  positive: +1,
  neutral: 0,
  negative: -2,
  nonsense: -1
}
```

### Behavior (全NPC共通Enum)

```typescript
type Behavior =
  | "friendly"     // 協力的
  | "neutral"      // 普通
  | "cautious"     // 警戒
  | "annoyed"      // 不快
  | "angry"        // 怒り
  | "confused"     // 困惑
  | "dismissive"   // 無関心
```

### NPCConfig

```typescript
interface NPCConfig {
  id: string
  name: string
  age: number
  occupation: string
  personality: string[]
  speechStyle: string[]
  background: string
  knowledge: string[]

  affinity: {
    initial: number
    impression_guide: {
      positive: string[]
      negative: string[]
      neutral: string[]
      nonsense: string[]
    }
  }

  behaviors: {
    [key in Behavior]?: {
      conditions: string[]
      affinity_range: [number, number]
      guideline: string
      toast: string
    }
  }
  default_behavior: Behavior

  clues: Array<{
    id: string
    label: string
    content: string
  }>

  clue_conditions: {
    [clue_id: string]: {
      affinity: { min?: number, max?: number, range?: [number, number] }
      required_context?: string
      required_clues?: string[]
    }
  }

  conversation: {
    max_turns: number | null
    turn_behavior: {
      early: string
      middle: string
      late: string
      final: string
    }
  }
}
```

### Request/Response

```typescript
interface NPCDialogueRequest {
  message: string
  history: ChatMessage[]
  affinity: number
  turn: { current: number, max: number | null }
  revealed_clues: string[]
  npc: NPCConfig
}

interface NPCDialogueResponse {
  impression: { type: Impression, reason: string }
  affinity: { previous: number, change: number, current: number }
  behavior: { type: Behavior, reason: string }
  response: { text: string, internal_thought: string }
  clues: { revealed: string[], withheld: string[] }
  conversation: { should_end: boolean, end_reason?: string }
}
```

## tool schema (Claude API)

```typescript
tool: npc_response
input: {
  impression: {
    type: Impression
    reason: string
  }
  affinity: {
    previous: number
    change: number  // -2 ~ +2
    current: number
  }
  behavior: {
    type: Behavior
    reason: string
  }
  response: {
    text: string
    internal_thought: string
  }
  clues: {
    revealed: string[]
    withheld: string[]
  }
  conversation: {
    should_end: boolean
    end_reason?: string
  }
}
```

## clue_conditions examples

```typescript
// 好感度が高いと開示
witness_time: { affinity: { min: 5 } }

// 好感度が低いと開示（怒りで口滑らせる）
alibi_hole: { affinity: { max: 3 } }

// 特定レンジで開示
secret_affair: { affinity: { range: [2, 4] } }

// 前提条件あり
victim_last_words: {
  affinity: { min: 8 },
  required_clues: ["witness_time"]
}
```

## UI behavior

- response.text → チャット欄に表示
- behavior.toast → トーストで表示（例:「山田さんは協力的だ」）
- affinity変化 → UI上で可視化（任意）

## files

```
page.tsx                    # UI
api/route.ts                # 汎用APIエンドポイント
api/types.ts                # 型定義
public/game/npcs/*.json     # NPC設定ファイル（開発用）
```

## next steps

1. types.ts - 型定義確定
2. public/game/npcs/grandpa.json - サンプルNPC設定
3. api/route.ts - 汎用API化
4. page.tsx - 設定読み込み + リクエスト送信
