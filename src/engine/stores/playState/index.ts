// src/engine/stores/playState/index.ts

// 公開フック
export { usePlayStateStore } from "./useStore"

// 型
export type { Playhead, PlayStateStoreState } from "./internalStore"

// 内部用（engine内のマネージャー層からのみ使用可）
export { internalStore as playStateInternalStore } from "./internalStore"
