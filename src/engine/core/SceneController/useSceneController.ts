/**
 * useSceneController - SceneController 状態管理
 *
 * TODO: 実装
 */
"use client"

import { create } from "zustand"

type SceneControllerState = {
  currentScene: Record<string, unknown> | null
  isLoading: boolean
}

type SceneControllerActions = {
  loadScene: (scene: Record<string, unknown>) => void
  reset: () => void
}

const useSceneControllerStore = create<SceneControllerState & SceneControllerActions>(
  (set) => ({
    currentScene: null,
    isLoading: false,

    loadScene: (scene) =>
      set({
        currentScene: scene,
        isLoading: false,
      }),

    reset: () =>
      set({
        currentScene: null,
        isLoading: false,
      }),
  })
)

/**
 * SceneController の状態を読む
 */
export function useSceneController() {
  const currentScene = useSceneControllerStore((s) => s.currentScene)
  const isLoading = useSceneControllerStore((s) => s.isLoading)

  return { currentScene, isLoading }
}

/**
 * SceneController のアクションを取得
 */
export function useSceneControllerActions() {
  const loadScene = useSceneControllerStore((s) => s.loadScene)
  const reset = useSceneControllerStore((s) => s.reset)

  return { loadScene, reset }
}
