// src/engine/features/Dialogue/components/MessageBubble/defaults.ts

import type { MessageBubbleStyle } from "./types"

/**
 * MessageBubble のデフォルトスタイル設定
 */
export const defaultMessageBubbleStyle: MessageBubbleStyle = {
  // 親コンテナに対する幅（%）
  widthPercent: 70,

  // 吹き出し同士の間隔（px）
  gap: 15,

  // 名前部分
  name: {
    fontSize: "text-xl",
    fontWeight: "font-bold",
    color: "rgba(255,255,255,0.9)",
    textShadow:
      "1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 0 0 8px rgba(0,0,0,0.8)",
  },

  // アンダーライン
  underline: {
    height: 3,
    gap: 6,
    shimmerSpeed: 3.5,
    showShimmer: true,
  },

  // 吹き出し
  bubble: {
    fontSize: "text-xl",
    lineHeight: "leading-relaxed",
    textColor: "text-white",
    bgColor: "bg-gray-800/80",
    borderRadius: "rounded-2xl",
    paddingX: 16,
    paddingY: 12,
  },

  // 次へインジケーター
  nextIndicator: {
    symbol: "◆",
    size: "text-xs",
    baselineOffset: 2,
    bounceDuration: 1.2,
    bounceHeight: 3,
    pulseDuration: 2.1,
    minOpacity: 0.4,
    show: true,
  },
}
