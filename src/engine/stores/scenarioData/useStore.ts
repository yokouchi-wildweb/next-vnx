// src/engine/stores/scenarioData/useStore.ts
"use client"

import { internalStore } from "./internalStore"

export function useScenarioDataStore() {
  const scenario = internalStore((s) => s.scenario)
  const setScenario = internalStore((s) => s.setScenario)
  const reset = internalStore((s) => s.reset)

  return { scenario, setScenario, reset }
}
