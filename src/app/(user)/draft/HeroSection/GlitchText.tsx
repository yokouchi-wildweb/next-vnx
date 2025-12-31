"use client";

import { useState, useEffect, useCallback } from "react";

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
  // フェーズ時間設定
  initialDuration = 300,
  accelDuration = 2000,
  topSpeedDuration = 3000,
  decodeDuration = 3000,
  // 速度・動作設定
  initialText,
  initialChar = "■",
  paddingChar = " ",
  randomChars = "アイウエオカキクケコサシスセソタチツテト01011010",
  randomSpeed = 50,
  // グリッチ設定
  glitchInterval = 5000,
  glitchDuration = 200,
}: GlitchTextProps) {
  // 初期表示文字列を生成
  const createInitialDisplay = useCallback(() => {
    if (initialText !== undefined) {
      // initialTextが指定されている場合、左右交互にパディング
      const targetLen = text.length;
      const sourceLen = initialText.length;

      if (sourceLen >= targetLen) {
        // 長い場合は切り詰め
        return initialText.slice(0, targetLen);
      }

      // 短い場合は左右交互にパディング
      const diff = targetLen - sourceLen;
      const leftPad = Math.floor(diff / 2);
      const rightPad = diff - leftPad;

      return paddingChar.repeat(leftPad) + initialText + paddingChar.repeat(rightPad);
    }

    // initialTextがない場合は従来通りinitialCharで埋める
    return text
      .split("")
      .map((char) => (char === " " || char === "　" ? char : initialChar))
      .join("");
  }, [text, initialText, initialChar, paddingChar]);

  const [displayText, setDisplayText] = useState(createInitialDisplay);
  const [phase, setPhase] = useState<"initial" | "random-accel" | "random-top" | "decoding" | "done">("initial");
  const [isGlitching, setIsGlitching] = useState(false);

  // ランダム文字を取得
  const getRandomChar = useCallback(() => {
    return randomChars[Math.floor(Math.random() * randomChars.length)];
  }, [randomChars]);

  // 全文字をランダムに生成
  const generateRandomText = useCallback(() => {
    return text
      .split("")
      .map((char) => {
        if (char === " " || char === "　") return char;
        return getRandomChar();
      })
      .join("");
  }, [text, getRandomChar]);

  // 一部の文字だけをランダムに更新（各文字が独立して変化）
  const updatePartialRandom = useCallback((current: string, changeRate: number) => {
    return current
      .split("")
      .map((char, index) => {
        const originalChar = text[index];
        if (originalChar === " " || originalChar === "　") return char;
        // changeRateの確率で更新
        if (Math.random() < changeRate) {
          return getRandomChar();
        }
        return char;
      })
      .join("");
  }, [text, getRandomChar]);

  // 初期フェーズ: 指定時間待ってからランダム加速フェーズへ
  useEffect(() => {
    if (phase !== "initial") return;

    const timeout = setTimeout(() => {
      setPhase("random-accel");
    }, initialDuration);

    return () => clearTimeout(timeout);
  }, [phase, initialDuration]);

  // ランダム加速フェーズ: ゆっくり→加速、各文字がバラバラに変化
  useEffect(() => {
    if (phase !== "random-accel") return;

    const startSpeed = 400; // 開始時は400ms間隔
    const endSpeed = randomSpeed;
    const startTime = Date.now();
    let timeoutId: NodeJS.Timeout;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / accelDuration, 1);
      // ease-in: 最初遅く、後で速く
      const eased = progress * progress;

      // 変化率も徐々に上げる（最初は30%、最後は80%）
      const changeRate = 0.3 + 0.5 * eased;

      setDisplayText((prev) => updatePartialRandom(prev, changeRate));

      if (progress >= 1) {
        setPhase("random-top");
        return;
      }

      // 速度を計算
      const currentSpeed = startSpeed - (startSpeed - endSpeed) * eased;
      timeoutId = setTimeout(tick, currentSpeed);
    };

    tick();

    return () => clearTimeout(timeoutId);
  }, [phase, accelDuration, randomSpeed, updatePartialRandom]);

  // ランダムトップスピードフェーズ: 高速で変化し続ける
  useEffect(() => {
    if (phase !== "random-top") return;

    let timeoutId: NodeJS.Timeout;
    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;

      // 各文字が60%の確率で変化（バラバラ感を出す）
      setDisplayText((prev) => updatePartialRandom(prev, 0.6));

      if (elapsed >= topSpeedDuration) {
        setPhase("decoding");
        return;
      }

      timeoutId = setTimeout(tick, randomSpeed);
    };

    tick();

    return () => clearTimeout(timeoutId);
  }, [phase, topSpeedDuration, randomSpeed, updatePartialRandom]);

  // デコードフェーズ: random-topと同じ速度を維持しながらデコード
  useEffect(() => {
    if (phase !== "decoding") return;

    const startTime = Date.now();
    let timeoutId: NodeJS.Timeout;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / decodeDuration, 1);
      // ease-in: 最初遅く、後で速く（確定する文字数の進行）
      const eased = progress * progress;

      // 進捗に応じて確定する文字数を計算
      const confirmedCount = Math.floor(eased * text.length);

      // 未確定文字は確率的にランダム更新（random-topと同じ挙動）
      setDisplayText((prev) =>
        text
          .split("")
          .map((char, index) => {
            if (char === " " || char === "　") return char;
            if (index < confirmedCount) return char; // 確定済み
            // 未確定文字は60%の確率で更新（バラバラ感を維持）
            if (Math.random() < 0.6) {
              return getRandomChar();
            }
            return prev[index] || getRandomChar();
          })
          .join("")
      );

      if (progress >= 1) {
        // 最終的にすべての文字を確定
        setDisplayText(text);
        setPhase("done");
        return;
      }

      // 速度はrandomSpeedを維持（トップスピードのまま）
      timeoutId = setTimeout(tick, randomSpeed);
    };

    tick();

    return () => clearTimeout(timeoutId);
  }, [phase, text, decodeDuration, randomSpeed, getRandomChar]);

  // フェーズ2: 定期グリッチ
  useEffect(() => {
    if (phase !== "done") return;

    const triggerGlitch = () => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), glitchDuration);
    };

    // デコード完了直後に一度グリッチ
    const initialDelay = setTimeout(triggerGlitch, 500);

    // 一定間隔でグリッチ
    const interval = setInterval(triggerGlitch, glitchInterval);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, [phase, glitchInterval, glitchDuration]);

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
