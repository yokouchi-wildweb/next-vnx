// src/engine/stores/gameState/index.ts

// 公開フック
export { useGameStateStore } from "./useStore"

// 型
export type { Playhead, GameStateStoreState } from "./internalStore"

// 内部用（engine内のマネージャー層からのみ使用可）
export { internalStore as gameStateInternalStore } from "./internalStore"
