"use client";

import { useState, useCallback } from "react";
import { PentagonCard } from "./PentagonCard";
import { cn } from "@/lib/cn";
import { useViewportSizeStore } from "@/stores/viewportSize";
import { SectionTitle } from "../SectionTitle";
import {
  BREAKPOINT,
  CARD_SIZE_MOBILE,
  CARD_SIZE_DESKTOP,
  CAROUSEL_PERSPECTIVE,
  CAROUSEL_TRANSLATE_X_1,
  CAROUSEL_TRANSLATE_X_2,
  CAROUSEL_HEIGHT_MOBILE,
  CAROUSEL_HEIGHT_DESKTOP,
  CAROUSEL_POSITION_CONFIGS,
} from "./constants";

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
      "最新のAI技術で、あなたのアイデアを魅力的な物語に変換。キャラクター設定から展開まで自動生成。キャラクター設定から展開まで自動生成キャラクター設定から展開まで自動生成",
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

export function FeatureCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = FEATURES.length;

  // ビューポート幅に応じてカードサイズを切り替え
  const { width } = useViewportSizeStore();
  const isMobile = width < BREAKPOINT;
  const cardSize = isMobile ? CARD_SIZE_MOBILE : CARD_SIZE_DESKTOP;
  const containerHeight = isMobile ? CAROUSEL_HEIGHT_MOBILE : CAROUSEL_HEIGHT_DESKTOP;

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
    const translateX1 = cardSize * CAROUSEL_TRANSLATE_X_1;
    const translateX2 = cardSize * CAROUSEL_TRANSLATE_X_2;

    // 共通スタイル
    const baseStyle: React.CSSProperties = {
      transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease",
      position: "absolute",
      left: "50%",
      marginLeft: `${marginLeftValue}px`,
    };

    // 表示範囲外（前後2枚より遠い）は非表示
    if (absPos > 2) {
      return {
        ...baseStyle,
        transform: "translateX(0) translateZ(-500px) scale(0.3)",
        opacity: 0,
        zIndex: 0,
        pointerEvents: "none",
      };
    }

    // 位置設定を取得
    const config = CAROUSEL_POSITION_CONFIGS[absPos as 0 | 1 | 2];

    // translateX計算（位置に応じた値）
    let translateX = 0;
    if (absPos === 1) {
      translateX = position * translateX1;
    } else if (absPos === 2) {
      translateX = position * translateX2;
    }

    // rotateY計算（中央以外は回転）
    const rotateY = absPos === 0
      ? 0
      : position * (config as { rotateYMultiplier: number }).rotateYMultiplier;

    return {
      ...baseStyle,
      transform: `translateX(${translateX}px) translateZ(${config.translateZ}px) scale(${config.scale}) rotateY(${rotateY}deg)`,
      opacity: config.opacity,
      zIndex: 10 - absPos,
      pointerEvents: "auto",
    };
  };

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* セクションタイトル */}
      <SectionTitle
        title="Features"
        subtitle="次世代のビジュアルノベル制作を実現する機能"
        color="cyan"
        size="lg"
        className="mb-12 md:mb-20"
      />

      {/* カルーセル */}
      <div
        className="relative mx-auto max-w-6xl"
        style={{
          height: `${containerHeight}px`,
          perspective: `${CAROUSEL_PERSPECTIVE}px`,
        }}
      >
        {/* カードコンテナ */}
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
                className={cn(position !== 0 && "cursor-pointer")}
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
