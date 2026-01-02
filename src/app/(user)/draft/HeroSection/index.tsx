"use client";

import { useState, useEffect, useRef } from "react";
import { imgPath } from "@/utils/assets";
import Image from "next/image";
import { ActionPanel } from "./ActionPanel";
import { BorderLight } from "./BorderLight";
import { DecorativeDots } from "./DecorativeDots";
import { GlitchText, GlitchTextHandle } from "./GlitchText";

/** スライドデータ */
const SLIDES = [
  { image: "heroes/dream_sity-2.jpg", text: "物語を、もっと自由に。" },
  { image: "heroes/space_burst.jpg", text: "思うままに未来を描いて…" },
  { image: "heroes/fantasy_tale-2.jpg", text: "現実を超えろ。" },
];

/** 設定 */
const CONFIG = {
  interval: 8000,      // 切り替え間隔（ミリ秒）
  fadeDuration: 3000,  // フェード時間（ミリ秒）
  fadeDelay: 1500,
};

type HeroSectionProps = {
  imageAlt?: string;
};

export function HeroSection({
  imageAlt = "Hero Image",
}: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [fadeOut, setFadeOut] = useState(false);
  const glitchTextRef = useRef<GlitchTextHandle>(null);

  // 自動切り替え
  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % SLIDES.length;

      // テキストトランジション開始（即座に）
      glitchTextRef.current?.startTransition(SLIDES[nextIndex].text);

      // 画像トランジション開始（fadeDelay後）
      setTimeout(() => {
        setPrevIndex(currentIndex);
        setCurrentIndex(nextIndex);
        setFadeOut(false);
      }, CONFIG.fadeDelay);
    }, CONFIG.interval);

    return () => clearInterval(timer);
  }, [currentIndex]);

  // prevIndex がセットされたらフェードアウト開始
  useEffect(() => {
    if (prevIndex === null) return;

    // 次のフレームでフェードアウト開始（CSS transitionを発火させるため）
    const frameId = requestAnimationFrame(() => {
      setFadeOut(true);
    });

    return () => cancelAnimationFrame(frameId);
  }, [prevIndex]);

  // フェード完了後に prevIndex をクリア
  useEffect(() => {
    if (!fadeOut) return;

    const timer = setTimeout(() => {
      setPrevIndex(null);
      setFadeOut(false);
    }, CONFIG.fadeDuration);

    return () => clearTimeout(timer);
  }, [fadeOut]);

  const currentSlide = SLIDES[currentIndex];
  const prevSlide = prevIndex !== null ? SLIDES[prevIndex] : null;
  return (
    <section className="relative mx-auto max-w-6xl p-0 md:px-1 md:py-8 pb-32 md:pb-16">
      {/* コンテナ */}
      <div className="relative rounded-none md:rounded-2xl overflow-visible">
        {/* ヒーロー画像（背景として全体に広がる） */}
        <div className="relative w-full overflow-hidden rounded-none md:rounded-2xl aspect-[4/5] md:aspect-[16/9]">
          {/* 現在の画像（常に表示、下層） */}
          <Image
            src={imgPath(currentSlide.image)}
            alt={imageAlt}
            fill
            className="object-cover"
            priority
          />
          {/* 前の画像（フェードアウト中のみ表示、上層） */}
          {prevSlide && (
            <Image
              src={imgPath(prevSlide.image)}
              alt={imageAlt}
              fill
              className="object-cover"
              style={{
                opacity: fadeOut ? 0 : 1,
                transition: `opacity ${CONFIG.fadeDuration}ms linear`,
              }}
              priority
            />
          )}

          {/* キャッチコピー（中央配置） */}
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              <GlitchText
                ref={glitchTextRef}
                text={SLIDES[0].text}
                // フェーズ時間設定（ミリ秒）
                initialDuration={2000}      // 初期文字で静止
                accelDuration={2000}       // ゆっくり→加速ランダム
                topSpeedDuration={1000}    // トップスピードランダム
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
                // トランジション設定
                transScrambleDuration={1500}
                transTopDuration={1000}
                transDecodeDuration={1500}
              />
            </h1>
          </div>
        </div>

        {/* 内側のグラデーションボーダー（画像の上に重なる） */}
        <div
          className="pointer-events-none absolute inset-2 md:inset-3 rounded-xl border-2 md:border-4 border-transparent"
          style={{
            background: "linear-gradient(90deg, var(--gradient-primary-colors)) border-box",
            mask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
          }}
        />

        {/* ボーダー上を走る光のアニメーション（スマホでは非表示） */}
        <BorderLight className="pointer-events-none absolute inset-0 w-full h-full hidden md:block" />

        {/* 左上の白いドット（SVGアニメーション・セクションから飛び出し） */}
        <DecorativeDots className="absolute -top-9 -left-12 z-10 scale-50 md:scale-100" />

        {/* 右下の心電図波形 */}
        {/*<HeartbeatWave className="absolute bottom-8 -right-16 z-10 w-[36rem] opacity-70" />*/}

        {/* アクションパネル */}
        <ActionPanel />
      </div>
    </section>
  );
}
