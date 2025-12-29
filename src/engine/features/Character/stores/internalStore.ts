/**
 * Character Store（内部実装）
 *
 * 直接使用禁止。useStore.ts 経由でアクセスすること。
 */
"use client"

import { create } from "zustand"
import type { Position, SceneCharacter } from "../types"

/** キャラクターの表示状態 */
export type CharacterDisplayState = {
  /** 表示中か */
  visible: boolean
  /** 位置 */
  position: Position
  /** 現在のスプライト */
  sprite?: string
  /** スケール */
  scale?: number
}

/** Character ストアの状態 */
export type CharacterState = {
  /** キャラクター設定（scene.json から） */
  characterConfigs: Record<string, SceneCharacter>
  /** キャラクターの表示状態 */
  displayStates: Record<string, CharacterDisplayState>
  /** 現在の話者 */
  currentSpeaker: string | null
}

/** Character ストアのアクション */
type CharacterActions = {
  /** 初期化 */
  initialize: (characters: Record<string, SceneCharacter>) => void
  /** キャラクターを表示 */
  show: (id: string, options?: { position?: Position; sprite?: string }) => void
  /** キャラクターを非表示 */
  hide: (id: string) => void
  /** キャラクターを移動 */
  move: (id: string, position: Position) => void
  /** スプライトを変更 */
  setSprite: (id: string, sprite: string) => void
  /** 話者を設定 */
  setSpeaker: (id: string | null) => void
  /** リセット */
  reset: () => void
}

const initialState: CharacterState = {
  characterConfigs: {},
  displayStates: {},
  currentSpeaker: null,
}

export const internalStore = create<CharacterState & CharacterActions>(
  (set) => ({
    ...initialState,

    initialize: (characters) =>
      set({
        characterConfigs: characters,
        displayStates: Object.fromEntries(
          Object.entries(characters).map(([id, config]) => [
            id,
            {
              visible: false,
              position: config.position,
              sprite: config.sprite,
              scale: config.scale,
            },
          ])
        ),
      }),

    show: (id, options) =>
      set((state) => {
        const current = state.displayStates[id]
        if (!current) return state
        return {
          displayStates: {
            ...state.displayStates,
            [id]: {
              ...current,
              visible: true,
              ...(options?.position && { position: options.position }),
              ...(options?.sprite && { sprite: options.sprite }),
            },
          },
        }
      }),

    hide: (id) =>
      set((state) => {
        const current = state.displayStates[id]
        if (!current) return state
        return {
          displayStates: {
            ...state.displayStates,
            [id]: { ...current, visible: false },
          },
        }
      }),

    move: (id, position) =>
      set((state) => {
        const current = state.displayStates[id]
        if (!current) return state
        return {
          displayStates: {
            ...state.displayStates,
            [id]: { ...current, position },
          },
        }
      }),

    setSprite: (id, sprite) =>
      set((state) => {
        const current = state.displayStates[id]
        if (!current) return state
        return {
          displayStates: {
            ...state.displayStates,
            [id]: { ...current, sprite },
          },
        }
      }),

    setSpeaker: (id) => set({ currentSpeaker: id }),

    reset: () => set(initialState),
  })
)
