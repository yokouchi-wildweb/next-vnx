"use client";

import { HudFrame } from "@/components/Widgets/HudFrame";

type HudFrameSectionProps = {
  maxWidth?: string;
};

/** サービス概要セクション（HudFrame使用） */
export function HudFrameSection({ maxWidth }: HudFrameSectionProps) {
  return (
    <section className="relative py-8 md:py-16 px-4">
      <div className="relative mx-auto">
        <HudFrame
          maxWidth={maxWidth}
          title="NEXT-VNX"
          subtitle="SYSTEM.OVERVIEW"
          showStatusBar
          statusText="CREATIVE_MODE | ONLINE"
        >
          <HudFrameContent />
        </HudFrame>
      </div>
    </section>
  );
}

/** コンテンツ部分 */
function HudFrameContent() {
  return (
    <div className="relative px-6 md:px-12 py-12 md:py-16">
      {/* 背景のグリッドパターン */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      {/* コンテンツ */}
      <div className="relative text-center space-y-6 md:space-y-8">
        {/* メインタイトル */}
        <h2
          className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-wide"
          style={{
            background:
              "linear-gradient(135deg, #22d3ee 0%, #a78bfa 50%, #f472b6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 20px rgba(139, 92, 246, 0.3))",
          }}
        >
          Next VNXでできること
        </h2>

        {/* 装飾ライン */}
        <div className="flex items-center justify-center gap-3">
          <div
            className="w-8 md:w-12 h-px"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(34, 211, 238, 0.6))",
            }}
          />
          <span className="text-sm text-cyan-400/60">◇</span>
          <div
            className="w-8 md:w-12 h-px"
            style={{
              background:
                "linear-gradient(to left, transparent, rgba(34, 211, 238, 0.6))",
            }}
          />
        </div>

        {/* 説明文 */}
        <div className="space-y-3 md:space-y-4 max-w-2xl mx-auto">
          <p className="text-lg md:text-2xl font-light tracking-wide text-white/90">
            誰もが物語のクリエイターに
          </p>
          <p className="text-sm md:text-base tracking-wider text-white/50">
            ノベルゲーム / マーダーミステリー
          </p>
          <p className="text-base md:text-lg text-white/70">
            思い通りにシナリオ創作
          </p>
          <p className="text-base md:text-lg text-white/70">
            あなたのアイデアを実現する
          </p>
          <p
            className="text-lg md:text-xl font-medium tracking-wide pt-2 text-cyan-300/90"
            style={{
              textShadow: "0 0 20px rgba(6, 182, 212, 0.4)",
            }}
          >
            次世代の創作スタジオ
          </p>
        </div>
      </div>

      {/* 浮遊する装飾 */}
      <div className="absolute top-8 left-8 text-xs font-mono animate-float-particle text-cyan-400/20">
        ✦
      </div>
      <div
        className="absolute top-12 right-12 text-sm animate-float-particle text-purple-400/20"
        style={{ animationDelay: "1s" }}
      >
        ◇
      </div>
      <div
        className="absolute bottom-8 left-16 text-xs animate-float-particle text-pink-400/20"
        style={{ animationDelay: "2s" }}
      >
        ✧
      </div>
      <div
        className="absolute bottom-12 right-8 text-xs font-mono animate-float-particle text-cyan-400/20"
        style={{ animationDelay: "1.5s" }}
      >
        ◈
      </div>
    </div>
  );
}
