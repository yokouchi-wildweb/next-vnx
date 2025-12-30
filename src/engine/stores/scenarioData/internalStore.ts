// src/engine/stores/scenarioData/internalStore.ts
"use client"

import { create } from "zustand"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Scenario = any

type ScenarioDataStore = {
  scenario: Scenario | null
  setScenario: (scenario: Scenario) => void
  reset: () => void
}

export const internalStore = create<ScenarioDataStore>((set) => ({
  scenario: null,
  setScenario: (scenario) => set({ scenario }),
  reset: () => set({ scenario: null }),
}))
