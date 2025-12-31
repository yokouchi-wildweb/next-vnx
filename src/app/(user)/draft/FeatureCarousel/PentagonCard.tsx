"use client";

import { cn } from "@/lib/cn";
import Image from "next/image";
import { imgPath } from "@/utils/assets";

// 正五角形のclip-path（上が頂点）
// 頂点座標は中心(50%,50%)から半径50%で、-90°から72°ずつ
// cos/sin計算:
//   0: (50%, 0%)
//   1: (50 + 50*cos(-18°), 50 + 50*sin(-18°)) ≈ (97.55%, 34.55%)
//   2: (50 + 50*cos(54°), 50 + 50*sin(54°)) ≈ (79.39%, 90.45%)
//   3: (50 + 50*cos(126°), 50 + 50*sin(126°)) ≈ (20.61%, 90.45%)
//   4: (50 + 50*cos(198°), 50 + 50*sin(198°)) ≈ (2.45%, 34.55%)
const PENTAGON_CLIP = "polygon(50% 0%, 97.55% 34.55%, 79.39% 90.45%, 20.61% 90.45%, 2.45% 34.55%)";

/** コンテンツパディングの比率（サイズに対する割合: 80px / 450px ≈ 0.178） */
const CONTENT_PADDING_RATIO = 0.178;

type PentagonCardProps = {
  image: string;
  title: string;
  description: string;
  /** カードのサイズ（px） */
  size?: number;
  /** グラデーションの開始色 (oklch形式推奨) */
  gradientFrom?: string;
  /** グラデーションの終了色 (oklch形式推奨) */
  gradientTo?: string;
  /** ボーダーの太さ（px） */
  borderWidth?: number;
  className?: string;
};

export function PentagonCard({
  image,
  title,
  description,
  size = 450,
  gradientFrom = "oklch(0.85 0.15 85)", // 黄色系デフォルト
  gradientTo = "oklch(0.75 0.18 60)",
  borderWidth = 4, // ボーダー太さ
  className,
}: PentagonCardProps) {
  // サイズに応じてcontentPaddingを自動計算
  const contentPadding = Math.round(size * CONTENT_PADDING_RATIO);
  return (
    // 正五角形のアスペクト比: 幅95.1% / 高さ90.45% ≈ 1.05 → aspect-ratio: 1/0.95
    <div
      className={cn("relative aspect-square", className)}
      style={{ width: `${size}px` }}
    >
      {/* 外側：グラデーションボーダー */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: PENTAGON_CLIP,
          background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
        }}
      />

      {/* 内側：コンテンツエリア（ボーダー分だけ内側に） */}
      <div
        className="absolute bg-card/95 backdrop-blur-sm"
        style={{
          clipPath: PENTAGON_CLIP,
          inset: `${borderWidth}px`,
        }}
      >
      </div>

      {/* ホログラム風テキストエリア（五角形の外に配置） */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-10"
        style={{
          bottom: `${contentPadding * 1}px`,
          width: "75%",
          perspective: "500px",
        }}
      >
        {/* グロー（背景） */}
        <div
          className="absolute inset-0 rounded-lg opacity-40 blur-lg"
          style={{
            background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
            transform: "translateZ(-10px) scale(1.05)",
          }}
        />
        {/* テキストパネル */}
        <div
          className="relative rounded-lg px-4 py-3 backdrop-blur-md"
          style={{
            transform: "rotateX(-3deg) translateZ(5px)",
            transformStyle: "preserve-3d",
            background: "rgba(0,0,0,0.6)",
            boxShadow: `
              0 10px 30px -5px rgba(0,0,0,0.4),
              0 0 20px -5px ${gradientFrom}
            `,
            border: `1px solid rgba(255,255,255,0.1)`,
          }}
        >
          {/* タイトル */}
          <h3 className="text-base md:text-lg font-bold text-white mb-1 text-center">
            {title}
          </h3>

          {/* 説明文 */}
          <p className="text-sm text-white/70 text-center line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      {/* ホログラム浮遊画像（五角形の外に配置、切り取られない） */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-10"
        style={{
          top: `${contentPadding * 0.6}px`,
          height: "45%",
          aspectRatio: "16/10",
          perspective: "500px",
        }}
      >
        {/* ホログラムグロー（背景） */}
        <div
          className="absolute inset-0 rounded-lg opacity-60 blur-xl"
          style={{
            background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
            transform: "translateZ(-20px) scale(1.1)",
          }}
        />
        {/* メイン画像（傾き＋浮遊） */}
        <div
          className="relative w-full h-full rounded-lg overflow-hidden"
          style={{
            transform: "rotateX(4deg) rotateY(-2deg) translateZ(10px)",
            transformStyle: "preserve-3d",
            boxShadow: `
              0 20px 40px -10px rgba(0,0,0,0.5),
              0 0 30px -5px ${gradientFrom}
            `,
          }}
        >
          <Image
            src={imgPath(image)}
            alt={title}
            fill
            className="object-cover"
          />
          {/* ホログラムオーバーレイ（虹色の光沢） */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(
                135deg,
                transparent 0%,
                rgba(255,255,255,0.1) 25%,
                transparent 50%,
                rgba(120,200,255,0.08) 75%,
                transparent 100%
              )`,
            }}
          />
          {/* スキャンライン効果 */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)",
            }}
          />
        </div>
      </div>

      {/* 光沢エフェクト（オプション） */}
      <div
        className="absolute pointer-events-none"
        style={{
          clipPath: PENTAGON_CLIP,
          inset: `${borderWidth}px`,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)",
        }}
      />
    </div>
  );
}
