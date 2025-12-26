# Lab002: AI Dialogue

purpose: LLM NPC会話実験（推理ゲーム証言収集）
status: prototype/experimental
issues: [haiku指示無視, tool_use時テキスト空→"..."フォールバック]

## files
- page.tsx: UI（NPC切替/チャット/手がかり）
- api/route.ts: Claude連携、Tool Use処理
- api/types.ts: NPCConfig/Clue型
- api/npcs/*.ts: NPC定義（grandpa/friend/suspicious）

## flow
user入力 → axios POST → buildSystemPrompt + buildTools → Claude API → 解析(text+tool_use) → {content, revealedClues}

## NPCConfig
id,name,age,occupation,personality[],speechStyle[],goal,knowledge[],restrictions[],clues[{id,label}],additionalPrompt?

## tool_use
name: reveal_clue
input: {clue_id: enum[npc.clues.id]}
trigger: AI判断で手がかり開示時

## debug
API_CONFIG.debug=true → [AI-Dialogue]ログ、空text時⚠️警告+生content出力

## model
default: claude-3-haiku-20240307 (maxTokens:1024)
alt: claude-sonnet-4-20250514, claude-opus-4-20250514

## scenario
victim: 鈴木翔太(28) / player: 探偵
npcs: grandpa(目撃者), friend(友人/異変知る), suspicious(容疑者風だが無関係/不倫隠し)
