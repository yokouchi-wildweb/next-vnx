"use client";

import { forwardRef, useImperativeHandle } from "react";
import { useGlitchAnimation } from "./useGlitchAnimation";

export type GlitchTextHandle = {
  startTransition: (newText: string) => void;
};

type GlitchTextProps = {
  /**
   * 表示するテキスト（最終的にデコードされる文字列）
   * @example "物語を、もっと自由に。"
   */
  text: string;

  /** 追加のCSSクラス */
  className?: string;

  // ═══════════════════════════════════════════════════════════════
  // フェーズ時間設定（ミリ秒）
  // ═══════════════════════════════════════════════════════════════

  /**
   * フェーズ1: 初期文字で静止する時間
   * @default 300 (ミリ秒 = 0.3秒)
   */
  initialDuration?: number;

  /**
   * フェーズ2: ゆっくり→加速しながらランダム変化する時間
   * @default 2000 (ミリ秒 = 2秒)
   */
  accelDuration?: number;

  /**
   * フェーズ3: トップスピードでランダム変化する時間
   * @default 3000 (ミリ秒 = 3秒)
   */
  topSpeedDuration?: number;

  /**
   * フェーズ4: デコードにかかる総時間
   * @default 3000 (ミリ秒 = 3秒)
   */
  decodeDuration?: number;

  // ═══════════════════════════════════════════════════════════════
  // 速度・動作設定
  // ═══════════════════════════════════════════════════════════════

  /**
   * 初期表示文字列（textと文字数が異なる場合は左右交互にパディング）
   * @example "NEXT-VNX" → " NEXT-VNX " (10文字のtextに対して)
   */
  initialText?: string;

  /**
   * 初期表示文字（initialTextがない場合に使用、各文字をこれで埋める）
   * @default "■"
   * @example "・" "█" "◆" "?"
   */
  initialChar?: string;

  /**
   * パディングに使用する文字
   * @default " "（半角スペース）
   */
  paddingChar?: string;

  /**
   * ランダム変化に使用する文字セット
   * @default "アイウエオカキクケコサシスセソタチツテト01011010"
   * @example "ABCDEF0123456789" "αβγδε" "███░░░"
   */
  randomChars?: string;

  /**
   * ランダム表示の更新間隔（トップスピード時）
   * 値が小さいほど高速に変化する
   * @default 50 (ミリ秒)
   */
  randomSpeed?: number;

  // ═══════════════════════════════════════════════════════════════
  // グリッチエフェクト設定
  // ═══════════════════════════════════════════════════════════════

  /**
   * グリッチエフェクトの発生間隔
   * デコード完了後、この間隔でグリッチが発生する
   * @default 5000 (ミリ秒 = 5秒)
   */
  glitchInterval?: number;

  /**
   * グリッチエフェクトの持続時間
   * @default 200 (ミリ秒)
   */
  glitchDuration?: number;

  // ═══════════════════════════════════════════════════════════════
  // トランジション設定
  // ═══════════════════════════════════════════════════════════════

  /**
   * トランジション時のスクランブル加速時間
   * @default 1500 (ミリ秒)
   */
  transScrambleDuration?: number;

  /**
   * トランジション時のトップスピード時間
   * @default 1000 (ミリ秒)
   */
  transTopDuration?: number;

  /**
   * トランジション時のデコード時間
   * @default 1500 (ミリ秒)
   */
  transDecodeDuration?: number;
};

/**
 * デコード/マトリックス風の登場 + 定期グリッチエフェクト
 *
 * アニメーションフェーズ:
 * 1. initial (0.3秒): 初期文字で静止
 * 2. random-accel (2秒): ゆっくり→加速しながらランダム変化
 * 3. random-top (3秒): トップスピードでランダム変化
 * 4. decoding: ゆっくり→加速しながら正しい文字にデコード
 * 5. done: 定期的にグリッチエフェクト
 *
 * トランジションフェーズ（startTransition呼び出し時）:
 * 1. trans-scramble: 現テキストをランダム化（加速）
 * 2. trans-top: トップスピード（ここで文字数調整）
 * 3. trans-decode: 新テキストへデコード
 */
export const GlitchText = forwardRef<GlitchTextHandle, GlitchTextProps>(
  function GlitchText(
    {
      text,
      className = "",
      initialDuration = 300,
      accelDuration = 2000,
      topSpeedDuration = 3000,
      decodeDuration = 3000,
      initialText,
      initialChar = "■",
      paddingChar = " ",
      randomChars = "アイウエオカキクケコサシスセソタチツテト01011010",
      randomSpeed = 50,
      glitchInterval = 5000,
      glitchDuration = 200,
      transScrambleDuration = 1500,
      transTopDuration = 1000,
      transDecodeDuration = 1500,
    },
    ref
  ) {
    const { displayText, isGlitching, startTransition, targetText } = useGlitchAnimation({
      text,
      initialText,
      initialChar,
      paddingChar,
      randomChars,
      initialDuration,
      accelDuration,
      topSpeedDuration,
      decodeDuration,
      randomSpeed,
      glitchInterval,
      glitchDuration,
      transScrambleDuration,
      transTopDuration,
      transDecodeDuration,
    });

    useImperativeHandle(ref, () => ({
      startTransition,
    }));

  return (
    <span
      className={`glitch-text relative inline-block ${isGlitching ? "animate-glitch-skew" : ""} ${className}`}
      data-text={targetText}
    >
      {displayText}

      {/* グリッチ時の疑似要素（RGBずれ）- CSS擬似要素のためstyle必要 */}
      {isGlitching && (
        <style>{`
          .glitch-text::before,
          .glitch-text::after {
            content: attr(data-text);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.8;
          }
          .glitch-text::before {
            color: #ff00ff;
            animation: glitch-1 0.2s ease-in-out;
            clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
          }
          .glitch-text::after {
            color: #00ffff;
            animation: glitch-2 0.2s ease-in-out;
            clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
          }
        `}</style>
      )}
    </span>
  );
  }
);
