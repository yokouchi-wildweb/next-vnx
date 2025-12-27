// src/engine/stores/bgm/index.ts

// 公開フック
export { useBgmStore } from "./useStore"

// 型
export type { BgmState } from "./internalStore"

// 内部用（engine内のマネージャー層からのみ使用可）
export { internalStore as bgmInternalStore } from "./internalStore"
