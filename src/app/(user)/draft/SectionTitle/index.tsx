"use client";

import { cn } from "@/lib/cn";

type SectionTitleProps = {
  /** メインタイトル */
  title: string;
  /** サブタイトル（オプション） */
  subtitle?: string;
  /** ネオンカラー（デフォルト: cyan） */
  color?: "cyan" | "pink" | "purple" | "green" | "orange";
  /** タイトルサイズ */
  size?: "sm" | "md" | "lg";
  /** 装飾ラインを表示するか */
  showLines?: boolean;
  /** 外枠を表示するか */
  showBorder?: boolean;
  /** データノイズ背景を表示するか */
  showNoise?: boolean;
  /** 追加のクラス */
  className?: string;
};

// カラーパレット
const COLOR_CONFIGS = {
  cyan: {
    dot: "bg-cyan-400 shadow-[0_0_8px_2px_rgba(34,211,238,0.6)]",
    line: "from-cyan-400",
    lineShadow: "shadow-[0_0_8px_rgba(34,211,238,0.5)]",
    gradient: "linear-gradient(135deg, oklch(0.85 0.15 200), oklch(0.95 0.1 280), oklch(0.85 0.15 200))",
    glow: "drop-shadow(0 0 20px rgba(120, 200, 255, 0.5)) drop-shadow(0 0 40px rgba(120, 200, 255, 0.3))",
    noise: "rgba(120, 200, 255, 0.03)",
    border: "rgba(120, 200, 255, 0.2)",
    boxShadow: "inset 0 0 20px rgba(120, 200, 255, 0.1), 0 0 30px rgba(120, 200, 255, 0.1)",
  },
  pink: {
    dot: "bg-pink-400 shadow-[0_0_8px_2px_rgba(244,114,182,0.6)]",
    line: "from-pink-400",
    lineShadow: "shadow-[0_0_8px_rgba(244,114,182,0.5)]",
    gradient: "linear-gradient(135deg, oklch(0.75 0.2 350), oklch(0.85 0.15 320), oklch(0.75 0.2 350))",
    glow: "drop-shadow(0 0 20px rgba(244, 114, 182, 0.5)) drop-shadow(0 0 40px rgba(244, 114, 182, 0.3))",
    noise: "rgba(244, 114, 182, 0.03)",
    border: "rgba(244, 114, 182, 0.2)",
    boxShadow: "inset 0 0 20px rgba(244, 114, 182, 0.1), 0 0 30px rgba(244, 114, 182, 0.1)",
  },
  purple: {
    dot: "bg-purple-400 shadow-[0_0_8px_2px_rgba(192,132,252,0.6)]",
    line: "from-purple-400",
    lineShadow: "shadow-[0_0_8px_rgba(192,132,252,0.5)]",
    gradient: "linear-gradient(135deg, oklch(0.7 0.2 280), oklch(0.85 0.15 300), oklch(0.7 0.2 280))",
    glow: "drop-shadow(0 0 20px rgba(192, 132, 252, 0.5)) drop-shadow(0 0 40px rgba(192, 132, 252, 0.3))",
    noise: "rgba(192, 132, 252, 0.03)",
    border: "rgba(192, 132, 252, 0.2)",
    boxShadow: "inset 0 0 20px rgba(192, 132, 252, 0.1), 0 0 30px rgba(192, 132, 252, 0.1)",
  },
  green: {
    dot: "bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.6)]",
    line: "from-emerald-400",
    lineShadow: "shadow-[0_0_8px_rgba(52,211,153,0.5)]",
    gradient: "linear-gradient(135deg, oklch(0.8 0.18 160), oklch(0.9 0.12 140), oklch(0.8 0.18 160))",
    glow: "drop-shadow(0 0 20px rgba(52, 211, 153, 0.5)) drop-shadow(0 0 40px rgba(52, 211, 153, 0.3))",
    noise: "rgba(52, 211, 153, 0.03)",
    border: "rgba(52, 211, 153, 0.2)",
    boxShadow: "inset 0 0 20px rgba(52, 211, 153, 0.1), 0 0 30px rgba(52, 211, 153, 0.1)",
  },
  orange: {
    dot: "bg-orange-400 shadow-[0_0_8px_2px_rgba(251,146,60,0.6)]",
    line: "from-orange-400",
    lineShadow: "shadow-[0_0_8px_rgba(251,146,60,0.5)]",
    gradient: "linear-gradient(135deg, oklch(0.8 0.18 60), oklch(0.9 0.15 80), oklch(0.8 0.18 60))",
    glow: "drop-shadow(0 0 20px rgba(251, 146, 60, 0.5)) drop-shadow(0 0 40px rgba(251, 146, 60, 0.3))",
    noise: "rgba(251, 146, 60, 0.03)",
    border: "rgba(251, 146, 60, 0.2)",
    boxShadow: "inset 0 0 20px rgba(251, 146, 60, 0.1), 0 0 30px rgba(251, 146, 60, 0.1)",
  },
};

// サイズ設定
const SIZE_CONFIGS = {
  sm: {
    title: "text-2xl md:text-4xl",
    subtitle: "text-xs md:text-sm",
    dot: "w-1.5 h-1.5",
    line: "w-6 md:w-12",
    gap: "gap-3 md:gap-4",
    padding: "px-4 py-3",
  },
  md: {
    title: "text-3xl md:text-5xl",
    subtitle: "text-sm md:text-base",
    dot: "w-2 h-2",
    line: "w-8 md:w-16",
    gap: "gap-4 md:gap-6",
    padding: "px-6 py-4",
  },
  lg: {
    title: "text-4xl md:text-6xl",
    subtitle: "text-sm md:text-base",
    dot: "w-2.5 h-2.5",
    line: "w-10 md:w-20",
    gap: "gap-4 md:gap-6",
    padding: "px-8 py-5",
  },
};

export function SectionTitle({
  title,
  subtitle,
  color = "cyan",
  size = "lg",
  showLines = true,
  showBorder = true,
  showNoise = true,
  className,
}: SectionTitleProps) {
  const colorConfig = COLOR_CONFIGS[color];
  const sizeConfig = SIZE_CONFIGS[size];

  return (
    <div className={cn("text-center", className)}>
      {/* タイトルコンテナ */}
      <div className={cn("relative inline-flex flex-col items-center gap-3", sizeConfig.padding)}>
        {/* データノイズ背景 */}
        {showNoise && (
          <>
            <div
              className="absolute inset-0 rounded-lg opacity-30"
              style={{
                background: `
                  repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 2px,
                    ${colorConfig.noise} 2px,
                    ${colorConfig.noise} 4px
                  ),
                  repeating-linear-gradient(
                    90deg,
                    transparent,
                    transparent 4px,
                    ${colorConfig.noise} 4px,
                    ${colorConfig.noise} 8px
                  )
                `,
              }}
            />
            {/* ノイズグレイン */}
            <div
              className="absolute inset-0 rounded-lg opacity-20 mix-blend-overlay"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              }}
            />
          </>
        )}

        {/* 外枠グロー */}
        {showBorder && (
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              border: `1px solid ${colorConfig.border}`,
              boxShadow: colorConfig.boxShadow,
            }}
          />
        )}

        {/* タイトル行 */}
        <div className={cn("relative flex items-center", sizeConfig.gap)}>
          {/* 左装飾ライン */}
          {showLines && (
            <div className="flex items-center gap-1.5">
              <div className={cn("rounded-full", sizeConfig.dot, colorConfig.dot)} />
              <div
                className={cn(
                  "h-0.5 bg-gradient-to-r to-transparent",
                  sizeConfig.line,
                  colorConfig.line,
                  colorConfig.lineShadow
                )}
              />
            </div>
          )}

          {/* メインタイトル（ネオングロー） */}
          <h2
            className={cn("font-bold tracking-wider", sizeConfig.title)}
            style={{
              background: colorConfig.gradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: colorConfig.glow,
            }}
          >
            {title}
          </h2>

          {/* 右装飾ライン */}
          {showLines && (
            <div className="flex items-center gap-1.5">
              <div
                className={cn(
                  "h-0.5 bg-gradient-to-l to-transparent",
                  sizeConfig.line,
                  colorConfig.line,
                  colorConfig.lineShadow
                )}
              />
              <div className={cn("rounded-full", sizeConfig.dot, colorConfig.dot)} />
            </div>
          )}
        </div>

        {/* サブタイトル */}
        {subtitle && (
          <p className={cn("relative text-white/60 tracking-wide", sizeConfig.subtitle)}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
