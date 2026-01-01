"use client";

import { HudFrame, HudFrameAccentColor } from "@/components/Widgets/HudFrame";

type HudFrameSectionProps = {
  variant?: "dark" | "light";
  accentColor?: HudFrameAccentColor;
  maxWidth?: string;
};

/** サービス概要セクション（HudFrame使用） */
export function HudFrameSection({
  variant = "dark",
  accentColor = "cyan",
  maxWidth,
}: HudFrameSectionProps) {
  return (
    <section className="relative py-8 md:py-16 px-4">
      <div className="relative mx-auto">
        <HudFrame
          variant={variant}
          accentColor={accentColor}
          maxWidth={maxWidth}
          title="NEXT-VNX"
          subtitle="SYSTEM.OVERVIEW"
          showStatusBar
          statusText="CREATIVE_MODE | ONLINE"
        >
          <HudFrameContent variant={variant} accentColor={accentColor} />
        </HudFrame>
      </div>
    </section>
  );
}

/** コンテンツ部分 */
function HudFrameContent({
  variant,
  accentColor,
}: {
  variant: "dark" | "light";
  accentColor: HudFrameAccentColor;
}) {
  const isDark = variant === "dark";

  return (
    <div className="relative px-6 md:px-12 py-12 md:py-16">
      {/* 背景のグリッドパターン */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(${isDark ? "rgba(6, 182, 212, 0.5)" : "rgba(6, 182, 212, 0.3)"} 1px, transparent 1px),
            linear-gradient(90deg, ${isDark ? "rgba(6, 182, 212, 0.5)" : "rgba(6, 182, 212, 0.3)"} 1px, transparent 1px)
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
            background: isDark
              ? "linear-gradient(135deg, #22d3ee 0%, #a78bfa 50%, #f472b6 100%)"
              : "linear-gradient(135deg, #0891b2 0%, #7c3aed 50%, #db2777 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: isDark
              ? "drop-shadow(0 0 20px rgba(139, 92, 246, 0.3))"
              : "drop-shadow(0 0 15px rgba(139, 92, 246, 0.2))",
          }}
        >
          Next VNXでできること
        </h2>

        {/* 装飾ライン */}
        <div className="flex items-center justify-center gap-3">
          <div
            className="w-8 md:w-12 h-px"
            style={{
              background: `linear-gradient(to right, transparent, ${
                isDark ? "rgba(34, 211, 238, 0.6)" : "rgba(6, 182, 212, 0.5)"
              })`,
            }}
          />
          <span
            className={`text-sm ${isDark ? "text-cyan-400/60" : "text-cyan-500/60"}`}
          >
            ◇
          </span>
          <div
            className="w-8 md:w-12 h-px"
            style={{
              background: `linear-gradient(to left, transparent, ${
                isDark ? "rgba(34, 211, 238, 0.6)" : "rgba(6, 182, 212, 0.5)"
              })`,
            }}
          />
        </div>

        {/* 説明文 */}
        <div className="space-y-3 md:space-y-4 max-w-2xl mx-auto">
          <p
            className={`text-lg md:text-2xl font-light tracking-wide ${
              isDark ? "text-white/90" : "text-slate-800/90"
            }`}
          >
            誰もが物語のクリエイターに
          </p>
          <p
            className={`text-sm md:text-base tracking-wider ${
              isDark ? "text-white/50" : "text-slate-500/70"
            }`}
          >
            ノベルゲーム / マーダーミステリー
          </p>
          <p
            className={`text-base md:text-lg ${
              isDark ? "text-white/70" : "text-slate-700/80"
            }`}
          >
            思い通りにシナリオ創作
          </p>
          <p
            className={`text-base md:text-lg ${
              isDark ? "text-white/70" : "text-slate-700/80"
            }`}
          >
            あなたのアイデアを実現する
          </p>
          <p
            className={`text-lg md:text-xl font-medium tracking-wide pt-2 ${
              isDark ? "text-cyan-300/90" : "text-cyan-600/90"
            }`}
            style={{
              textShadow: isDark
                ? "0 0 20px rgba(6, 182, 212, 0.4)"
                : "0 0 15px rgba(6, 182, 212, 0.25)",
            }}
          >
            次世代の創作スタジオ
          </p>
        </div>
      </div>

      {/* 浮遊する装飾 */}
      <div
        className={`absolute top-8 left-8 text-xs font-mono animate-float-particle ${
          isDark ? "text-cyan-400/20" : "text-cyan-500/30"
        }`}
      >
        ✦
      </div>
      <div
        className={`absolute top-12 right-12 text-sm animate-float-particle ${
          isDark ? "text-purple-400/20" : "text-purple-500/30"
        }`}
        style={{ animationDelay: "1s" }}
      >
        ◇
      </div>
      <div
        className={`absolute bottom-8 left-16 text-xs animate-float-particle ${
          isDark ? "text-pink-400/20" : "text-pink-500/30"
        }`}
        style={{ animationDelay: "2s" }}
      >
        ✧
      </div>
      <div
        className={`absolute bottom-12 right-8 text-xs font-mono animate-float-particle ${
          isDark ? "text-cyan-400/20" : "text-cyan-500/30"
        }`}
        style={{ animationDelay: "1.5s" }}
      >
        ◈
      </div>
    </div>
  );
}
