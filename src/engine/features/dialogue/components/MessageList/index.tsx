/**
 * MessageList - メッセージ一覧表示コンポーネント
 *
 * Store を購読して自動的にメッセージを表示する。
 * スクロール + フェードマスク + 下揃え + アニメーション付き。
 */
"use client"

import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { mergeStyles } from "@/engine/utils/styleUtils"
import { useDialogueStore } from "../../stores"
import { MessageBubble } from "../MessageBubble"
import { defaultMessageBubbleStyle } from "../MessageBubble/defaults"
import { defaultMessageListLayout } from "../../defaults"
import type { MessageListProps } from "./types"

export function MessageList({
  layout: layoutOverrides,
  style,
  className,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { messages, currentSpeaker } = useDialogueStore()
  const layout = mergeStyles(defaultMessageListLayout, layoutOverrides)

  // メッセージ追加時に自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" })
  }, [messages])

  return (
    <div
      className={`max-h-full overflow-y-auto pointer-events-auto px-4 [&::-webkit-scrollbar]:hidden ${className ?? ""}`}
      style={{
        width: `clamp(${layout.minWidth}px, ${layout.widthPercent}%, ${layout.maxWidth}px)`,
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        WebkitMaskImage: `linear-gradient(to bottom, transparent 0%, black ${layout.fadeTop}%, black ${layout.fadeBottom}%, transparent 100%)`,
        maskImage: `linear-gradient(to bottom, transparent 0%, black ${layout.fadeTop}%, black ${layout.fadeBottom}%, transparent 100%)`,
        ...style,
      }}
    >
      {/* 内部コンテナ: 下揃え用 */}
      <div
        className="min-h-full flex flex-col justify-end pt-6"
        style={{
          gap: `${layout.gap}px`,
          paddingBottom: `${layout.paddingBottomPercent}%`,
        }}
      >
        {/* メッセージ一覧 */}
        <AnimatePresence>
          {messages.map((msg, index) => {
            const isLatest = index === messages.length - 1

            return (
              <motion.div
                key={msg.id}
                layout
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                  layout: { duration: 0.3, ease: "easeOut" },
                }}
                style={{
                  width: `${defaultMessageBubbleStyle.widthPercent}%`,
                  alignSelf: msg.side === "left" ? "flex-start" : "flex-end",
                }}
              >
                <MessageBubble
                  speakerName={msg.speakerName}
                  speakerColor={msg.speakerColor}
                  text={msg.text}
                  side={msg.side}
                  isLatest={isLatest}
                  opacity={isLatest ? 1 : 0.7}
                />
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* スクロール位置用 */}
        <div ref={messagesEndRef} />

        {/* 初期表示（メッセージがない時） */}
        {messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center animate-pulse">
              <p className="text-white/50 text-lg">クリックして開始</p>
              <p className="text-white/30 text-sm">BGMが流れます</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
