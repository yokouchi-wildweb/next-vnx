"use client";

import { Sparkles, Play } from "lucide-react";
import { HudFrame } from "@/components/Widgets/HudFrame";
import { Button } from "@/components/Form/Button/Button";
import { TypingText } from "./TypingText";

/** ヒーローセクション アクションパネル */
export function ActionPanel() {
  return (
    <div
      className="absolute bottom-0 z-20
        left-1/2 -translate-x-1/2 translate-y-3/5 w-[96%]
        md:left-auto md:right-8 md:translate-x-0 md:translate-y-1/6 md:w-[45%] md:max-w-md"
    >
      <HudFrame
        accent="purple"
        mode="light"
        title="GET STARTED"
        subtitle="ACTION"
        showStatusBar
        statusText="準備OK？?"
      >
        <div className="px-4 py-4 md:px-6 md:py-5 space-y-3 md:space-y-3">
          {/* キャッチフレーズ */}
          <p className="text-center text-lg md:text-xl">
            <TypingText text='今すぐ"VNX"を体験しよう！' variant="mono" />
          </p>

          {/* メインボタン（対になる2つ） */}
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            <Button
              variant="primary"
              size="lg"
              className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 hover:from-pink-600 hover:via-fuchsia-600 hover:to-purple-700 border-0"
            >
              <Sparkles className="size-4 animate-icon-sparkle" />
              シナリオを創る
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="bg-gradient-to-r from-cyan-400 via-cyan-500 to-teal-500 hover:from-cyan-500 hover:via-cyan-600 hover:to-teal-600 text-white border-0"
            >
              <Play className="size-4 animate-icon-scale" />
              シナリオで遊ぶ
            </Button>
          </div>

          {/* 追加ボタン（グラデーションボーダー） */}
          <button className="relative w-full cursor-pointer group">
            {/* グラデーションボーダー */}
            <span className="absolute inset-0 rounded-full bg-gradient-primary gradient-90 p-[2px]" />
            {/* 内側の背景 */}
            <span className="absolute inset-[2px] rounded-full bg-[#2e3458] group-hover:bg-[#3a4170] transition-colors" />
            {/* テキスト */}
            <span className="relative block py-2.5 px-6 text-white font-medium text-sm">
              公開中のシナリオ一覧へ
            </span>
          </button>
        </div>
      </HudFrame>
    </div>
  );
}
