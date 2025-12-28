/**
 * GameOrchestrator 型定義
 */

/** ゲームモード */
export type GameMode = "title" | "loading" | "playing" | "paused"

/** GameOrchestrator の状態 */
export type GameOrchestratorState = {
  mode: GameMode
  currentScenarioId: string | null
}

/** GameOrchestrator のアクション */
export type GameOrchestratorActions = {
  setMode: (mode: GameMode) => void
  startNewGame: (scenarioId: string) => void
  // TODO: loadGame, saveGame は SaveManager 連携後に実装
}
