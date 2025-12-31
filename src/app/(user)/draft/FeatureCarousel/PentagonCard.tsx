"use client";

import { cn } from "@/lib/cn";
import Image from "next/image";
import { imgPath } from "@/utils/assets";
import { useViewportSizeStore } from "@/stores/viewportSize";

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

  // ビューポート幅に応じてレイアウトを調整
  const { width: viewportWidth } = useViewportSizeStore();
  const isMobile = viewportWidth < 768;
  const textWidthRatio = isMobile ? 1.0 : 0.6;

  // 3D配置用の定数
  const plateRotateX = 70; // プレートの傾き（度）
  const imageHeight = size * 0.35; // 画像の高さ
  const textPanelHeight = 80; // テキストパネルの高さ（概算）

  return (
    // 全体のラッパー（モバイル時のテキスト用）
    <div className={cn("flex flex-col", className)} style={{ width: `${size}px` }}>
      {/* 3D空間のコンテナ */}
      <div
        className="relative"
        style={{
          width: `${size}px`,
          height: `${size * 0.8}px`, // 高さを調整（3D配置用）
          perspective: "1000px",
        }}
      >
      {/* 3Dシーン */}
      <div
        className="absolute inset-0"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* ===== 五角形プレート（横倒し） ===== */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            width: `${size * 1.4}px`,
            height: `${size * 1.4}px`,
            bottom: 0,
            transform: `rotateX(${plateRotateX}deg)`,
            transformOrigin: "center bottom",
            transformStyle: "preserve-3d",
          }}
        >
          {/* 外側：グラデーションボーダー */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: PENTAGON_CLIP,
              background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
            }}
          />
          {/* 内側：コンテンツエリア */}
          <div
            className="absolute bg-card/90 backdrop-blur-sm"
            style={{
              clipPath: PENTAGON_CLIP,
              inset: `${borderWidth}px`,
            }}
          />
          {/* 光沢エフェクト */}
          <div
            className="absolute pointer-events-none"
            style={{
              clipPath: PENTAGON_CLIP,
              inset: `${borderWidth}px`,
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)",
            }}
          />
        </div>

        {/* ===== 直立画像（プレートの上に立つ） ===== */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            width: `${size * 0.85}px`,
            height: `${size * 0.55}px`,
            bottom: `${size * (isMobile ? 0.20 : 0.30)}px`, // モバイルは低め
            transform: `translateZ(${size * -0.2}px)`, // 奥に配置
            transformStyle: "preserve-3d",
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
          {/* メイン画像 */}
          <div
            className="relative w-full h-full rounded-lg overflow-hidden"
            style={{
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
            {/* ホログラムオーバーレイ */}
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

        {/* ===== 直立テキストパネル（デスクトップのみ・画像の手前） ===== */}
        {!isMobile && (
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              width: `${size * textWidthRatio}px`,
              bottom: `${size * 0.15}px`,
              transform: `translateZ(${size * 0.05}px)`, // 少し手前に配置
              transformStyle: "preserve-3d",
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
                background: "rgba(0,0,0,0.7)",
                boxShadow: `
                  0 10px 30px -5px rgba(0,0,0,0.4),
                  0 0 20px -5px ${gradientFrom}
                `,
                border: `1px solid rgba(255,255,255,0.15)`,
              }}
            >
              {/* タイトル */}
              <h3 className="text-lg font-bold text-white mb-1 text-center">
                {title}
              </h3>
              {/* 説明文 */}
              <p className="text-sm text-white/70 text-center">
                {description}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>

      {/* ===== モバイル用テキストパネル（3D空間の外・下部に配置） ===== */}
      {isMobile && (
        <div className="mt-4 px-2 text-center">
          <h3 className="text-base font-bold text-white mb-1">
            {title}
          </h3>
          <p className="text-sm text-white/70">
            {description}
          </p>
        </div>
      )}
    </div>
  );
}
