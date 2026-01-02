"use client";

import { useGlitchAnimation } from "./useGlitchAnimation";

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
 */
export function GlitchText({
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
}: GlitchTextProps) {
  const { displayText, isGlitching } = useGlitchAnimation({
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
  });

  return (
    <span
      className={`glitch-text ${isGlitching ? "glitching" : ""} ${className}`}
      data-text={text}
    >
      {displayText}

      <style jsx>{`
        .glitch-text {
          position: relative;
          display: inline-block;
        }

        .glitch-text.glitching {
          animation: glitch-skew 0.2s ease-in-out;
        }

        /* グリッチ時の疑似要素（RGBずれ） */
        .glitch-text.glitching::before,
        .glitch-text.glitching::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.8;
        }

        .glitch-text.glitching::before {
          color: #ff00ff;
          animation: glitch-1 0.2s ease-in-out;
          clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
        }

        .glitch-text.glitching::after {
          color: #00ffff;
          animation: glitch-2 0.2s ease-in-out;
          clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
        }

        @keyframes glitch-skew {
          0% { transform: skewX(0deg); }
          20% { transform: skewX(-2deg); }
          40% { transform: skewX(2deg); }
          60% { transform: skewX(-1deg); }
          80% { transform: skewX(1deg); }
          100% { transform: skewX(0deg); }
        }

        @keyframes glitch-1 {
          0% { transform: translate(0); }
          20% { transform: translate(-3px, 1px); }
          40% { transform: translate(3px, -1px); }
          60% { transform: translate(-2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }

        @keyframes glitch-2 {
          0% { transform: translate(0); }
          20% { transform: translate(3px, -1px); }
          40% { transform: translate(-3px, 1px); }
          60% { transform: translate(2px, -2px); }
          80% { transform: translate(-2px, 2px); }
          100% { transform: translate(0); }
        }
      `}</style>
    </span>
  );
}
