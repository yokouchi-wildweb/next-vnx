// src/engine/features/Dialogue/stores/internalStore.ts
"use client"

import { create } from "zustand"

/** メッセージの配置方向 */
export type MessageSide = "left" | "right"

/** 表示するメッセージ */
export type DialogueMessage = {
  id: string
  speaker: string
  speakerName: string
  speakerColor: string
  text: string
  side: MessageSide
}

/** Dialogue ストアの状態 */
export type DialogueState = {
  /** 表示中のメッセージ一覧 */
  messages: DialogueMessage[]
  /** 現在の話者（ハイライト表示用） */
  currentSpeaker: string | null
}

/** Dialogue ストアのアクション */
type DialogueActions = {
  /** メッセージを追加 */
  addMessage: (message: Omit<DialogueMessage, "id">) => void
  /** 現在の話者を設定 */
  setSpeaker: (speaker: string | null) => void
  /** メッセージをクリア */
  clear: () => void
  /** 状態をリセット */
  reset: () => void
}

const initialState: DialogueState = {
  messages: [],
  currentSpeaker: null,
}

let messageIdCounter = 0

/**
 * Dialogue 状態ストア（内部実装）
 *
 * 直接使用禁止。useStore.ts 経由でアクセスすること。
 */
export const internalStore = create<DialogueState & DialogueActions>((set) => ({
  ...initialState,

  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { ...message, id: `msg-${++messageIdCounter}` },
      ],
      currentSpeaker: message.speaker,
    })),

  setSpeaker: (speaker) => set({ currentSpeaker: speaker }),

  clear: () => set({ messages: [], currentSpeaker: null }),

  reset: () => {
    messageIdCounter = 0
    set(initialState)
  },
}))
