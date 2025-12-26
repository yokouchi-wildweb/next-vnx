// src/app/lab/001-basic-scene/components/MessageBubble/index.tsx

"use client"

import { motion } from "framer-motion"
import { mergeStyles } from "@/engine/utils/styleUtils"
import { defaultMessageBubbleStyle } from "./defaults"
import type { MessageBubbleProps } from "./types"

/**
 * MessageBubble - チャット風メッセージ表示コンポーネント
 *
 * 構成:
 * - 発言者名（左/右寄せ）
 * - アンダーライン（シマーエフェクト付き）
 * - 吹き出し（メッセージ本文 + 次へインジケーター）
 *
 * 幅は親コンテナに対する % で指定（デフォルト90%）
 * 左右配置は親コンテナ側で制御
 */
export default function MessageBubble({
  speakerName,
  speakerColor,
  text,
  side,
  isLatest,
  opacity = 1,
  style: styleOverrides,
}: MessageBubbleProps) {
  const style = mergeStyles(defaultMessageBubbleStyle, styleOverrides)
  const textAlign = side === "left" ? "text-left" : "text-right"
  const cornerRadius = side === "left" ? "rounded-tl-sm" : "rounded-tr-sm"

  return (
    <div
      className="flex flex-col gap-1 w-full"
      style={{ opacity }}
    >
      {/* 発言者名 + アンダーライン */}
      <div
        className="relative w-full"
        style={{ paddingBottom: `${style.underline.gap}px` }}
      >
        <span
          className={`block ${style.name.fontSize} ${style.name.fontWeight} ${textAlign}`}
          style={{
            color: style.name.color,
            textShadow: style.name.textShadow,
          }}
        >
          {speakerName}
        </span>

        {/* アンダーライン + シマーエフェクト */}
        <div
          className="absolute bottom-0 left-0 right-0 overflow-hidden"
          style={{
            height: `${style.underline.height}px`,
            backgroundColor: speakerColor,
          }}
        >
          {isLatest && style.underline.showShimmer && (
            <div
              className="absolute inset-0 animate-shimmer"
              style={{
                background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)`,
                backgroundSize: "200% 100%",
                animationDuration: `${style.underline.shimmerSpeed}s`,
                animationDirection: side === "right" ? "reverse" : "normal",
              }}
            />
          )}
        </div>
      </div>

      {/* 吹き出し */}
      <div
        className={`w-full ${style.bubble.padding} ${style.bubble.borderRadius} ${style.bubble.bgColor} ${cornerRadius}`}
      >
        <p
          className={`${style.bubble.textColor} ${style.bubble.fontSize} ${style.bubble.lineHeight}`}
        >
          {text}

          {/* 次へインジケーター */}
          {isLatest && style.nextIndicator.show && (
            <motion.span
              className={`inline-block ml-2 ${style.nextIndicator.size}`}
              style={{
                color: speakerColor,
                position: "relative",
                top: `${style.nextIndicator.baselineOffset}px`,
              }}
              animate={{
                y: [0, -style.nextIndicator.bounceHeight, 0],
                opacity: [1, style.nextIndicator.minOpacity, 1],
              }}
              transition={{
                y: {
                  duration: style.nextIndicator.bounceDuration,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                opacity: {
                  duration: style.nextIndicator.pulseDuration,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            >
              {style.nextIndicator.symbol}
            </motion.span>
          )}
        </p>
      </div>
    </div>
  )
}
