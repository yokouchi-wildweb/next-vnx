// src/engine/audio/index.ts

/**
 * Audio Module - BGM/SE管理
 *
 * BGM: useBgmStore でグローバル状態管理（同時1曲のみ）
 * SE: playSe/playSeSequence で単発再生（同時複数可）
 */

// BGMストア
export { useBgmStore } from "./stores/useBgmStore"

// SE操作
export { playSe, playSeSequence } from "./se"
