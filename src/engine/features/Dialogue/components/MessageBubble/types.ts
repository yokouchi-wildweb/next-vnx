// src/engine/features/Dialogue/components/MessageBubble/types.ts

/**
 * MessageBubble コンポーネントの型定義
 */

/** 吹き出しの配置方向 */
export type BubbleSide = "left" | "right"

/** 名前部分のスタイル設定 */
export type NameStyle = {
  /** フォントサイズ（Tailwindクラス） */
  fontSize: string
  /** フォントウェイト（Tailwindクラス） */
  fontWeight: string
  /** テキストカラー */
  color: string
  /** テキストシャドウ */
  textShadow: string
}

/** アンダーラインのスタイル設定 */
export type UnderlineStyle = {
  /** ラインの太さ（px） */
  height: number
  /** 名前との間隔（px） */
  gap: number
  /** シマーエフェクトの速度（秒） */
  shimmerSpeed: number
  /** シマーエフェクトを表示するか */
  showShimmer: boolean
}

/** 吹き出しのスタイル設定 */
export type BubbleStyle = {
  /** テキストのフォントサイズ（Tailwindクラス） */
  fontSize: string
  /** 行の高さ（Tailwindクラス） */
  lineHeight: string
  /** テキストカラー（Tailwindクラス） */
  textColor: string
  /** 背景色（Tailwindクラス） */
  bgColor: string
  /** 角丸（Tailwindクラス） */
  borderRadius: string
  /** 水平パディング（px） */
  paddingX: number
  /** 垂直パディング（px） */
  paddingY: number
}

/** 次へインジケーターのスタイル設定 */
export type NextIndicatorStyle = {
  /** 表示するシンボル */
  symbol: string
  /** サイズ（Tailwindクラス） */
  size: string
  /** ベースラインオフセット（px） */
  baselineOffset: number
  /** バウンドアニメーション周期（秒） */
  bounceDuration: number
  /** バウンドの高さ（px） */
  bounceHeight: number
  /** 明滅アニメーション周期（秒） */
  pulseDuration: number
  /** 明滅時の最小不透明度 */
  minOpacity: number
  /** インジケーターを表示するか */
  show: boolean
}

/** MessageBubble 全体のスタイル設定 */
export type MessageBubbleStyle = {
  /** 親コンテナに対する幅（%） */
  widthPercent: number
  /** 吹き出し同士の間隔（px） */
  gap: number
  name: NameStyle
  underline: UnderlineStyle
  bubble: BubbleStyle
  nextIndicator: NextIndicatorStyle
}

/** MessageBubble コンポーネントのProps */
export type MessageBubbleProps = {
  /** 発言者の名前 */
  speakerName: string
  /** 発言者のテーマカラー（アンダーライン、インジケーターに使用） */
  speakerColor: string
  /** メッセージ本文 */
  text: string
  /** 配置方向（左/右） */
  side: BubbleSide
  /** 最新のメッセージかどうか（シマー、インジケーター表示に影響） */
  isLatest: boolean
  /** 不透明度 */
  opacity?: number
  /** スタイル設定（部分的にオーバーライド可能） */
  style?: Partial<MessageBubbleStyle>
}
