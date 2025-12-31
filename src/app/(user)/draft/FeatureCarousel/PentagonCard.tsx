"use client";

import { cn } from "@/lib/cn";
import Image from "next/image";
import { imgPath } from "@/utils/assets";
import { useViewportSizeStore } from "@/stores/viewportSize";
import {
  BREAKPOINT,
  PENTAGON_CLIP_PATH,
  PLATE_SCALE,
  PLATE_ROTATE_X,
  CONTAINER_HEIGHT_RATIO,
  IMAGE_WIDTH_RATIO,
  IMAGE_HEIGHT_RATIO,
  IMAGE_BOTTOM_RATIO_MOBILE,
  IMAGE_BOTTOM_RATIO_DESKTOP,
  IMAGE_TRANSLATE_Z_RATIO,
  TEXT_WIDTH_RATIO_MOBILE,
  TEXT_WIDTH_RATIO_DESKTOP,
  TEXT_BOTTOM_RATIO,
  TEXT_TRANSLATE_Z_RATIO,
} from "./constants";

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
  gradientFrom = "oklch(0.85 0.15 85)",
  gradientTo = "oklch(0.75 0.18 60)",
  borderWidth = 4,
  className,
}: PentagonCardProps) {
  // ビューポート幅に応じてレイアウトを調整
  const { width: viewportWidth } = useViewportSizeStore();
  const isMobile = viewportWidth < BREAKPOINT;

  // レスポンシブ値
  const textWidthRatio = isMobile ? TEXT_WIDTH_RATIO_MOBILE : TEXT_WIDTH_RATIO_DESKTOP;
  const imageBottomRatio = isMobile ? IMAGE_BOTTOM_RATIO_MOBILE : IMAGE_BOTTOM_RATIO_DESKTOP;

  return (
    <div className={cn("flex flex-col", className)} style={{ width: `${size}px` }}>
      {/* 3D空間のコンテナ */}
      <div
        className="relative"
        style={{
          width: `${size}px`,
          height: `${size * CONTAINER_HEIGHT_RATIO}px`,
          perspective: "1000px",
        }}
      >
        {/* 3Dシーン */}
        <div
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* ===== 五角形プレート（横倒し） ===== */}
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              width: `${size * PLATE_SCALE}px`,
              height: `${size * PLATE_SCALE}px`,
              bottom: 0,
              transform: `rotateX(${PLATE_ROTATE_X}deg)`,
              transformOrigin: "center bottom",
              transformStyle: "preserve-3d",
            }}
          >
            {/* 外側：グラデーションボーダー */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: PENTAGON_CLIP_PATH,
                background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
              }}
            />
            {/* 内側：コンテンツエリア */}
            <div
              className="absolute bg-card/90 backdrop-blur-sm"
              style={{
                clipPath: PENTAGON_CLIP_PATH,
                inset: `${borderWidth}px`,
              }}
            />
            {/* 光沢エフェクト */}
            <div
              className="absolute pointer-events-none"
              style={{
                clipPath: PENTAGON_CLIP_PATH,
                inset: `${borderWidth}px`,
                background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)",
              }}
            />
          </div>

          {/* ===== 直立画像（プレートの上に立つ） ===== */}
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              width: `${size * IMAGE_WIDTH_RATIO}px`,
              height: `${size * IMAGE_HEIGHT_RATIO}px`,
              bottom: `${size * imageBottomRatio}px`,
              transform: `translateZ(${size * IMAGE_TRANSLATE_Z_RATIO}px)`,
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
                bottom: `${size * TEXT_BOTTOM_RATIO}px`,
                transform: `translateZ(${size * TEXT_TRANSLATE_Z_RATIO}px)`,
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
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                <h3 className="text-lg font-bold text-white mb-1 text-center">
                  {title}
                </h3>
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
