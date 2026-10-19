// src/engine/stores/scenarioData/internalStore.ts
"use client"

import { create } from "zustand"

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
