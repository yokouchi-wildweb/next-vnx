/**
 * Dialogue Store（内部実装）
 *
 * 直接使用禁止。useStore.ts 経由でアクセスすること。
 */
"use client"

import { create } from "zustand"
import type { DialogueMessage, CharacterSlot, DialogueState } from "../types"
import {
  defaultLeftCharacterX,
  defaultRightCharacterX,
  defaultCharacterY,
  defaultCharacterWidthPercent,
  defaultCharacterAnchorX,
  defaultCharacterAnchorY,
} from "../defaults"

/** Dialogue ストアのアクション */
type DialogueActions = {
  // Messages
  /** メッセージを追加 */
  addMessage: (message: Omit<DialogueMessage, "id">) => void
  /** メッセージをクリア */
  clearMessages: () => void

  // Speaker
  /** 現在の話者を設定 */
  setSpeaker: (speaker: string | null) => void

  // Characters
  /** 左キャラクターを設定 */
  setLeftCharacter: (spritePath: string | null) => void
  /** 右キャラクターを設定 */
  setRightCharacter: (spritePath: string | null) => void
  /** キャラクターのアクティブ状態を更新（話者に基づく） */
  updateCharacterActiveState: () => void

  // Reset
  /** 状態をリセット */
  reset: () => void
}

const initialState: DialogueState = {
  messages: [],
  currentSpeaker: null,
  leftCharacter: null,
  rightCharacter: null,
}

let messageIdCounter = 0

/** キャラクタースロットを作成 */
function createCharacterSlot(
  spritePath: string,
  x: number
): CharacterSlot {
  return {
    spritePath,
    x,
    y: defaultCharacterY,
    widthPercent: defaultCharacterWidthPercent,
    anchorX: defaultCharacterAnchorX,
    anchorY: defaultCharacterAnchorY,
    isActive: true,
  }
}

export const internalStore = create<DialogueState & DialogueActions>(
  (set, get) => ({
    ...initialState,

    addMessage: (message) =>
      set((state) => ({
        messages: [
          ...state.messages,
          { ...message, id: `msg-${++messageIdCounter}` },
        ],
        currentSpeaker: message.speaker,
      })),

    clearMessages: () => set({ messages: [], currentSpeaker: null }),

    setSpeaker: (speaker) => {
      set({ currentSpeaker: speaker })
      get().updateCharacterActiveState()
    },

    setLeftCharacter: (spritePath) =>
      set({
        leftCharacter: spritePath
          ? createCharacterSlot(spritePath, defaultLeftCharacterX)
          : null,
      }),

    setRightCharacter: (spritePath) =>
      set({
        rightCharacter: spritePath
          ? createCharacterSlot(spritePath, defaultRightCharacterX)
          : null,
      }),

    updateCharacterActiveState: () =>
      set((state) => {
        const { leftCharacter, rightCharacter, currentSpeaker } = state

        // 話者がいない場合は両方アクティブ
        if (!currentSpeaker) {
          return {
            leftCharacter: leftCharacter
              ? { ...leftCharacter, isActive: true }
              : null,
            rightCharacter: rightCharacter
              ? { ...rightCharacter, isActive: true }
              : null,
          }
        }

        // 話者の side に基づいてアクティブ状態を更新
        const latestMessage = state.messages[state.messages.length - 1]
        const speakerSide = latestMessage?.side

        return {
          leftCharacter: leftCharacter
            ? { ...leftCharacter, isActive: speakerSide === "left" }
            : null,
          rightCharacter: rightCharacter
            ? { ...rightCharacter, isActive: speakerSide === "right" }
            : null,
        }
      }),

    reset: () => {
      messageIdCounter = 0
      set(initialState)
    },
  })
)
