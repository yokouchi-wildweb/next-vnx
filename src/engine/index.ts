/**
 * VNX Engine
 *
 * ビジュアルノベルエンジンのエントリーポイント
 * lab/ での実験を経て、汎用化されたコンポーネントをここからエクスポートする
 */

// TODO: lab/001-basic-scene 完了後に追加
// export { VNXPlayer } from './VNXPlayer'
// export { useSceneStore } from './stores/useSceneStore'
// export type { Scene, Dialogue, Character } from './types'

// Features（バンドル形式）
export { Background } from "./features/Background"
export { Character } from "./features/Character"

// Audio
export { bgmManager, useBgmStore, playSe, playSeSequence } from "./audio"
