// src/engine/features/Dialogue/stores/index.ts

// 公開フック
export { useDialogueStore } from "./useStore"

// 型
export type { DialogueState, DialogueMessage, MessageSide } from "./internalStore"

// 内部用（engine内のマネージャー層からのみ使用可）
export { internalStore as dialogueInternalStore } from "./internalStore"
