"use client";

import { useState, useCallback } from "react";
import { PentagonCard } from "./PentagonCard";
import { cn } from "@/lib/cn";
import { useViewportSizeStore } from "@/stores/viewportSize";

type Feature = {
  id: string;
  image: string;
  title: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
};

// サンプルデータ（3つ）
const FEATURES: Feature[] = [
  {
    id: "1",
    image: "heroes/dream_sity_with_logo.png",
    title: "AIストーリー生成",
    description:
      "最新のAI技術で、あなたのアイデアを魅力的な物語に変換。キャラクター設定から展開まで自動生成。",
    gradientFrom: "oklch(0.85 0.18 85)",
    gradientTo: "oklch(0.70 0.20 45)",
  },
  {
    id: "2",
    image: "heroes/dream_sity_with_logo.png",
    title: "Live2D統合",
    description:
      "Live2Dモデルをシームレスに統合。リアルタイムで表情や動きを制御できる次世代のVN体験。",
    gradientFrom: "oklch(0.75 0.20 160)",
    gradientTo: "oklch(0.60 0.22 200)",
  },
  {
    id: "3",
    image: "heroes/dream_sity_with_logo.png",
    title: "マルチプラットフォーム",
    description:
      "Web、デスクトップ、モバイル。一度作れば、どこでもプレイ可能な作品を簡単にエクスポート。",
    gradientFrom: "oklch(0.72 0.22 320)",
    gradientTo: "oklch(0.58 0.24 280)",
  },
];

/** カードサイズ（モバイル/デスクトップで自動切り替え） */
const CARD_SIZE_MOBILE = 300;
const CARD_SIZE_DESKTOP = 540;
const BREAKPOINT = 768;

export function FeatureCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = FEATURES.length;

  // ビューポート幅に応じてカードサイズを切り替え
  const { width } = useViewportSizeStore();
  const cardSize = width < BREAKPOINT ? CARD_SIZE_MOBILE : CARD_SIZE_DESKTOP;

  const goTo = useCallback((index: number) => {
    // 範囲内に収める（ループ）
    setActiveIndex((index % total + total) % total);
  }, [total]);

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  // 各カードの位置を計算（-2, -1, 0, 1, 2 の相対位置）
  const getRelativePosition = (index: number): number => {
    let diff = index - activeIndex;
    // ループ対応：最短距離を計算
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  // カードのスタイルを計算
  const getCardStyle = (index: number): React.CSSProperties => {
    const position = getRelativePosition(index);
    const absPos = Math.abs(position);

    // カードサイズに連動する値
    const marginLeftValue = -(cardSize / 2);
    const translateX1 = cardSize * 0.84;  // 380 / 450 ≈ 0.84
    const translateX2 = cardSize * 1.22;  // 550 / 450 ≈ 1.22

    // 表示範囲外（前後2枚より遠い）は非表示
    if (absPos > 2) {
      return {
        transform: "translateX(0) translateZ(-500px) scale(0.3)",
        opacity: 0,
        zIndex: 0,
        pointerEvents: "none" as const,
        transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease",
        position: "absolute" as const,
        left: "50%",
        marginLeft: `${marginLeftValue}px`,
      };
    }

    // 中央からの距離に応じてスタイルを変える（遠近感を強調）
    const configs: Record<number, { scale: number; translateX: number; translateZ: number; rotateY: number; opacity: number }> = {
      0: { scale: 1.0, translateX: 0, translateZ: 0, rotateY: 0, opacity: 1 },
      1: { scale: 0.55, translateX: position * translateX1, translateZ: -350, rotateY: position * -30, opacity: 0.6 },
      2: { scale: 0.35, translateX: position * translateX2, translateZ: -550, rotateY: position * -40, opacity: 0.3 },
    };

    const config = configs[absPos] || configs[2];

    return {
      transform: `translateX(${config.translateX}px) translateZ(${config.translateZ}px) scale(${config.scale}) rotateY(${config.rotateY}deg)`,
      opacity: config.opacity,
      zIndex: 10 - absPos,
      pointerEvents: absPos === 0 ? "auto" as const : "auto" as const,
      transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease",
      position: "absolute" as const,
      left: "50%",
      marginLeft: `${marginLeftValue}px`,
    };
  };

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* セクションタイトル */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Features
        </h2>
        <p className="text-white/60 text-sm md:text-base">
          次世代のビジュアルノベル制作を実現する機能
        </p>
      </div>

      {/* カルーセル */}
      <div
        className="relative mx-auto max-w-6xl h-[420px] md:h-[520px]"
        style={{ perspective: "1000px" }}
      >
        {/* カードコンテナ - すべてのカードを常にレンダリング（DOM位置固定でアニメーション維持） */}
        <div
          className="relative w-full h-full"
          style={{ transformStyle: "preserve-3d" }}
        >
          {FEATURES.map((feature, index) => {
            const position = getRelativePosition(index);
            return (
              <div
                key={feature.id}
                style={getCardStyle(index)}
                onClick={() => position !== 0 && goTo(index)}
                className={cn(
                  position !== 0 && "cursor-pointer"
                )}
              >
                <PentagonCard
                  image={feature.image}
                  title={feature.title}
                  description={feature.description}
                  gradientFrom={feature.gradientFrom}
                  gradientTo={feature.gradientTo}
                  size={cardSize}
                />
              </div>
            );
          })}
        </div>

        {/* ナビゲーションボタン */}
        <button
          onClick={goPrev}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white/70 hover:bg-white/20 hover:text-white transition-all"
          aria-label="Previous"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={goNext}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white/70 hover:bg-white/20 hover:text-white transition-all"
          aria-label="Next"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* ドットインジケーター */}
      <div className="flex justify-center gap-2 mt-6">
        {FEATURES.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-300",
              index === activeIndex
                ? "bg-white scale-125"
                : "bg-white/30 hover:bg-white/50"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
