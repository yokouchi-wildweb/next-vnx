"use client";

import { imgPath } from "@/utils/assets";
import Image from "next/image";
import { BorderLight } from "./BorderLight";
import { DecorativeDots } from "./DecorativeDots";
import { GlitchText } from "./GlitchText";
import { HeartbeatWave } from "./HeartbeatWave";

type HeroSectionProps = {
  imageSrc?: string;
  imageAlt?: string;
  aspectRatio?: string;
};

export function HeroSection({
  imageSrc = "heroes/dream_sity_with_logo.png",
  imageAlt = "Hero Image",
  aspectRatio = "16/9",
}: HeroSectionProps) {
  return (
    <section className="relative mx-auto max-w-6xl px-4 py-8">
      {/* コンテナ */}
      <div className="relative rounded-2xl overflow-visible">
        {/* ヒーロー画像（背景として全体に広がる） */}
        <div
          className="relative w-full overflow-hidden rounded-2xl"
          style={{ aspectRatio }}
        >
          <Image
            src={imgPath(imageSrc)}
            alt={imageAlt}
            fill
            className="object-cover"
            priority
          />

          {/* キャッチコピー（中央配置） */}
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              <GlitchText
                text="物語を、もっと自由に。"
                // フェーズ時間設定（ミリ秒）
                initialDuration={2000}      // 初期文字で静止
                accelDuration={2000}       // ゆっくり→加速ランダム
                topSpeedDuration={2000}    // トップスピードランダム
                decodeDuration={2000}      // デコード完了まで
                // 文字設定
                initialText="NEXT-VNX"   // 左右にパディングされる
                paddingChar=" "          // パディング文字
                randomChars="������ΨΨΨΨΨΨŠÅアイウエオワオン現実を超えろ進化した君は未来を創造する"
                // 速度設定
                randomSpeed={50}           // トップスピード時の更新間隔
                // グリッチ設定
                glitchInterval={4000}      // グリッチ発生間隔
                glitchDuration={200}       // グリッチ持続時間
              />
            </h1>
          </div>
        </div>

        {/* 内側のグラデーションボーダー（画像の上に重なる） */}
        <div
          className="pointer-events-none absolute inset-3 rounded-xl"
          style={{
            border: "4px solid transparent",
            background: "linear-gradient(90deg, oklch(0.72 0.22 350), oklch(0.62 0.23 280)) border-box",
            mask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
          }}
        />

        {/* ボーダー上を走る光のアニメーション */}
        <BorderLight className="pointer-events-none absolute inset-0 w-full h-full" />

        {/* 左上の白いドット（SVGアニメーション・セクションから飛び出し） */}
        <DecorativeDots className="absolute -top-12 -left-12 z-10" />

        {/* 右下の心電図波形 */}
        <HeartbeatWave className="absolute bottom-8 -right-16 z-10 w-[36rem] opacity-70" />
      </div>
    </section>
  );
}
