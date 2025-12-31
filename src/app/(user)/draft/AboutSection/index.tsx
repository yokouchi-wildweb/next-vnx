"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { SectionTitle } from "../SectionTitle";

// 分裂パネルのデータ
const PANELS = [
  {
    id: 1,
    text: "Next VNXは、次世代のビジュアルノベル制作プラットフォーム。",
    offset: { x: -20, y: -15, rotate: -3 },
    glitchDelay: 0,
  },
  {
    id: 2,
    text: "AIによるストーリー生成、Live2Dキャラクター、",
    offset: { x: 25, y: 10, rotate: 2 },
    glitchDelay: 100,
  },
  {
    id: 3,
    text: "リアルタイム音声合成を統合した革新的なエンジン。",
    offset: { x: -15, y: 20, rotate: -1.5 },
    glitchDelay: 200,
  },
  {
    id: 4,
    text: "誰もが物語のクリエイターになれる世界を実現する。",
    offset: { x: 30, y: -5, rotate: 2.5 },
    glitchDelay: 300,
  },
];

type SplitPanelProps = {
  text: string;
  offset: { x: number; y: number; rotate: number };
  glitchDelay: number;
  isHovered: boolean;
  index: number;
};

function SplitPanel({ text, offset, glitchDelay, isHovered, index }: SplitPanelProps) {
  return (
    <div
      className={cn(
        "relative px-6 py-4 rounded-lg transition-all duration-500 ease-out",
        "border border-cyan-500/30",
        "backdrop-blur-sm",
        // グリッチアニメーション
        !isHovered && "animate-panel-float"
      )}
      style={{
        // 分裂時のオフセット or 統合時は0
        transform: isHovered
          ? "translate(0, 0) rotate(0deg)"
          : `translate(${offset.x}px, ${offset.y}px) rotate(${offset.rotate}deg)`,
        // 背景グラデーション
        background: `linear-gradient(
          135deg,
          rgba(6, 182, 212, 0.1) 0%,
          rgba(139, 92, 246, 0.08) 50%,
          rgba(6, 182, 212, 0.1) 100%
        )`,
        boxShadow: isHovered
          ? "0 0 30px rgba(6, 182, 212, 0.3), inset 0 0 20px rgba(6, 182, 212, 0.1)"
          : "0 0 15px rgba(6, 182, 212, 0.2), inset 0 0 10px rgba(6, 182, 212, 0.05)",
        animationDelay: `${glitchDelay}ms`,
        // z-indexで重なり順
        zIndex: isHovered ? 10 : 10 - index,
      }}
    >
      {/* スキャンライン */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg opacity-20"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(6, 182, 212, 0.1) 2px,
            rgba(6, 182, 212, 0.1) 4px
          )`,
        }}
      />

      {/* コーナーマーカー */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400/60" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400/60" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400/60" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400/60" />

      {/* テキスト */}
      <p
        className={cn(
          "relative text-base md:text-lg text-white/90 tracking-wide font-light",
          "transition-all duration-300"
        )}
      >
        {text}
      </p>

      {/* グリッチオーバーレイ（ホバー解除時にランダムフラッシュ） */}
      {!isHovered && (
        <div
          className="absolute inset-0 pointer-events-none rounded-lg animate-glitch-flash"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(6, 182, 212, 0.3) 50%, transparent 100%)",
            animationDelay: `${glitchDelay + 500}ms`,
          }}
        />
      )}
    </div>
  );
}

export function AboutSection() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* セクションタイトル */}
      <SectionTitle
        title="About"
        subtitle="Next VNXとは"
        color="purple"
        size="lg"
        className="mb-12 md:mb-16"
      />

      {/* 分裂パネルコンテナ */}
      <div
        className="relative mx-auto max-w-3xl px-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 統合時の背景グロー */}
        <div
          className={cn(
            "absolute inset-0 rounded-2xl transition-all duration-700",
            isHovered ? "opacity-100" : "opacity-0"
          )}
          style={{
            background: "radial-gradient(ellipse at center, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        {/* パネルスタック */}
        <div className="relative flex flex-col gap-3">
          {PANELS.map((panel, index) => (
            <SplitPanel
              key={panel.id}
              text={panel.text}
              offset={panel.offset}
              glitchDelay={panel.glitchDelay}
              isHovered={isHovered}
              index={index}
            />
          ))}
        </div>

        {/* ホバーヒント */}
        <p
          className={cn(
            "text-center mt-8 text-sm text-white/40 transition-opacity duration-500",
            isHovered ? "opacity-0" : "opacity-100"
          )}
        >
          ↑ hover to merge
        </p>
      </div>

      {/* 装飾：浮遊パーティクル */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/40 rounded-full animate-float-particle"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.5}s`,
            }}
          />
        ))}
      </div>
    </section>
  );
}
