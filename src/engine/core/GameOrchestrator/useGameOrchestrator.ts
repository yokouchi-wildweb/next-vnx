/**
 * useGameOrchestrator - GameOrchestrator 状態管理
 */
"use client"

import { create } from "zustand"
import type {
  GameOrchestratorState,
  GameOrchestratorActions,
  GameMode,
} from "./types"

type GameOrchestratorStore = GameOrchestratorState & GameOrchestratorActions

const useGameOrchestratorStore = create<GameOrchestratorStore>((set) => ({
  // 状態
  mode: "title",
  currentScenarioId: null,

  // アクション
  setMode: (mode: GameMode) => set({ mode }),

  startNewGame: (scenarioId: string) =>
    set({
      mode: "playing",
      currentScenarioId: scenarioId,
    }),
}))

/**
 * GameOrchestrator の状態を読む
 */
export function useGameOrchestrator() {
  const mode = useGameOrchestratorStore((s) => s.mode)
  const currentScenarioId = useGameOrchestratorStore((s) => s.currentScenarioId)

  return { mode, currentScenarioId }
}

/**
 * GameOrchestrator のアクションを取得
 */
export function useGameOrchestratorActions() {
  const setMode = useGameOrchestratorStore((s) => s.setMode)
  const startNewGame = useGameOrchestratorStore((s) => s.startNewGame)

  return { setMode, startNewGame }
}
