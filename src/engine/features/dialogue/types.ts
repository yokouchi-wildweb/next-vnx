/**
 * Dialogue Feature 型定義
 */

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

/** キャラクタースロット */
export type CharacterSlot = {
  /** スプライトパス */
  spritePath: string
  /** X座標（0-1） */
  x: number
  /** Y座標（0-1） */
  y: number
  /** 画面幅に対するサイズ（%） */
  widthPercent: number
  /** アンカー X */
  anchorX: number
  /** アンカー Y */
  anchorY: number
  /** アクティブ状態（発言中か） */
  isActive: boolean
}

/** Dialogue ストアの状態 */
export type DialogueState = {
  /** 表示中のメッセージ一覧 */
  messages: DialogueMessage[]
  /** 現在の話者 */
  currentSpeaker: string | null
  /** 左キャラクター */
  leftCharacter: CharacterSlot | null
  /** 右キャラクター */
  rightCharacter: CharacterSlot | null
}

/** MessageList の配置設定 */
export type MessageListLayout = {
  /** 上端オフセット（%） */
  topOffset: number
  /** 下端オフセット（%） */
  bottomOffset: number
  /** 幅（%） */
  widthPercent: number
  /** 最小幅（px） */
  minWidth: number
  /** 最大幅（px） */
  maxWidth: number
  /** 上部フェード終了位置（%） */
  fadeTop: number
  /** 下部フェード開始位置（%） */
  fadeBottom: number
  /** 下部パディング（%） */
  paddingBottomPercent: number
  /** メッセージ間隔（px） */
  gap: number
}
