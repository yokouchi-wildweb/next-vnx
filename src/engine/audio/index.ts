// src/engine/audio/index.ts

/**
 * Audio Module - BGM/SE管理
 *
 * BGM:
 *   - bgmManager: 再生ロジック（play, stop, pause, resume, fadeOut）
 *   - useBgmStore: 状態参照（currentBgmKey, volume, isPlaying）
 *
 * SE:
 *   - playSe/playSeSequence: 単発再生（同時複数可）
 */

// BGM
export { bgmManager } from "./bgmManager"
export { useBgmStore } from "../stores/bgm"

// SE
export { playSe, playSeSequence } from "./se"
