"use client";

import { useState, useEffect, useCallback } from "react";

type GlitchPhase =
  | "initial"
  | "random-accel"
  | "random-top"
  | "decoding"
  | "done"
  | "trans-scramble"
  | "trans-top"
  | "trans-decode";

type UseGlitchAnimationOptions = {
  /** 表示するテキスト */
  text: string;
  /** 初期表示文字列 */
  initialText?: string;
  /** 初期表示文字 */
  initialChar?: string;
  /** パディング文字 */
  paddingChar?: string;
  /** ランダム文字セット */
  randomChars?: string;
  /** フェーズ1: 初期文字で静止する時間 */
  initialDuration?: number;
  /** フェーズ2: 加速ランダム変化時間 */
  accelDuration?: number;
  /** フェーズ3: トップスピード時間 */
  topSpeedDuration?: number;
  /** フェーズ4: デコード時間 */
  decodeDuration?: number;
  /** ランダム更新間隔（トップスピード時） */
  randomSpeed?: number;
  /** グリッチ発生間隔 */
  glitchInterval?: number;
  /** グリッチ持続時間 */
  glitchDuration?: number;
  /** トランジション時のスクランブル加速時間 */
  transScrambleDuration?: number;
  /** トランジション時のトップスピード時間 */
  transTopDuration?: number;
  /** トランジション時のデコード時間 */
  transDecodeDuration?: number;
};

/**
 * グリッチテキストアニメーションのロジックを管理するカスタムフック
 */
export function useGlitchAnimation({
  text,
  initialText,
  initialChar = "■",
  paddingChar = " ",
  randomChars = "アイウエオカキクケコサシスセソタチツテト01011010",
  initialDuration = 300,
  accelDuration = 2000,
  topSpeedDuration = 3000,
  decodeDuration = 3000,
  randomSpeed = 50,
  glitchInterval = 5000,
  glitchDuration = 200,
  transScrambleDuration = 1500,
  transTopDuration = 1000,
  transDecodeDuration = 1500,
}: UseGlitchAnimationOptions) {
  // 現在のターゲットテキスト（トランジション時に変更される）
  const [targetText, setTargetText] = useState(text);
  // 初期表示文字列を生成
  const createInitialDisplay = useCallback(() => {
    if (initialText !== undefined) {
      const targetLen = text.length;
      const sourceLen = initialText.length;

      if (sourceLen >= targetLen) {
        return initialText.slice(0, targetLen);
      }

      const diff = targetLen - sourceLen;
      const leftPad = Math.floor(diff / 2);
      const rightPad = diff - leftPad;

      return paddingChar.repeat(leftPad) + initialText + paddingChar.repeat(rightPad);
    }

    return text
      .split("")
      .map((char) => (char === " " || char === "　" ? char : initialChar))
      .join("");
  }, [text, initialText, initialChar, paddingChar]);

  const [displayText, setDisplayText] = useState(createInitialDisplay);
  const [phase, setPhase] = useState<GlitchPhase>("initial");
  const [isGlitching, setIsGlitching] = useState(false);

  // ランダム文字を取得
  const getRandomChar = useCallback(() => {
    return randomChars[Math.floor(Math.random() * randomChars.length)];
  }, [randomChars]);

  // 一部の文字だけをランダムに更新（参照テキストを指定可能）
  const updatePartialRandom = useCallback(
    (current: string, changeRate: number, refText?: string) => {
      const reference = refText ?? text;
      return current
        .split("")
        .map((char, index) => {
          const originalChar = reference[index];
          if (originalChar === " " || originalChar === "　") return char;
          if (Math.random() < changeRate) {
            return getRandomChar();
          }
          return char;
        })
        .join("");
    },
    [text, getRandomChar]
  );

  // 指定した長さのランダム文字列を生成
  const generateRandomText = useCallback(
    (length: number) => {
      return Array.from({ length }, () => getRandomChar()).join("");
    },
    [getRandomChar]
  );

  // トランジション開始
  const startTransition = useCallback(
    (newText: string) => {
      if (phase !== "done") return; // done以外では無視
      setTargetText(newText);
      setPhase("trans-scramble");
    },
    [phase]
  );

  // フェーズ1: 初期静止
  useEffect(() => {
    if (phase !== "initial") return;

    const timeout = setTimeout(() => {
      setPhase("random-accel");
    }, initialDuration);

    return () => clearTimeout(timeout);
  }, [phase, initialDuration]);

  // フェーズ2: ランダム加速
  useEffect(() => {
    if (phase !== "random-accel") return;

    const startSpeed = 400;
    const endSpeed = randomSpeed;
    const startTime = Date.now();
    let timeoutId: NodeJS.Timeout;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / accelDuration, 1);
      const eased = progress * progress;
      const changeRate = 0.3 + 0.5 * eased;

      setDisplayText((prev) => updatePartialRandom(prev, changeRate));

      if (progress >= 1) {
        setPhase("random-top");
        return;
      }

      const currentSpeed = startSpeed - (startSpeed - endSpeed) * eased;
      timeoutId = setTimeout(tick, currentSpeed);
    };

    tick();
    return () => clearTimeout(timeoutId);
  }, [phase, accelDuration, randomSpeed, updatePartialRandom]);

  // フェーズ3: トップスピード
  useEffect(() => {
    if (phase !== "random-top") return;

    let timeoutId: NodeJS.Timeout;
    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
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

  // フェーズ4: デコード
  useEffect(() => {
    if (phase !== "decoding") return;

    const startTime = Date.now();
    let timeoutId: NodeJS.Timeout;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / decodeDuration, 1);
      const eased = progress * progress;
      const confirmedCount = Math.floor(eased * text.length);

      setDisplayText((prev) =>
        text
          .split("")
          .map((char, index) => {
            if (char === " " || char === "　") return char;
            if (index < confirmedCount) return char;
            if (Math.random() < 0.6) {
              return getRandomChar();
            }
            return prev[index] || getRandomChar();
          })
          .join("")
      );

      if (progress >= 1) {
        setDisplayText(text);
        setPhase("done");
        return;
      }

      timeoutId = setTimeout(tick, randomSpeed);
    };

    tick();
    return () => clearTimeout(timeoutId);
  }, [phase, text, decodeDuration, randomSpeed, getRandomChar]);

  // フェーズ5: 定期グリッチ
  useEffect(() => {
    if (phase !== "done") return;

    const triggerGlitch = () => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), glitchDuration);
    };

    const initialDelay = setTimeout(triggerGlitch, 500);
    const interval = setInterval(triggerGlitch, glitchInterval);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, [phase, glitchInterval, glitchDuration]);

  // ═══════════════════════════════════════════════════════════════
  // トランジションフェーズ
  // ═══════════════════════════════════════════════════════════════

  // トランジション1: スクランブル加速（現テキストの文字数でランダム化）
  useEffect(() => {
    if (phase !== "trans-scramble") return;

    const startSpeed = 400;
    const endSpeed = randomSpeed;
    const startTime = Date.now();
    let timeoutId: NodeJS.Timeout;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / transScrambleDuration, 1);
      const eased = progress * progress;
      const changeRate = 0.3 + 0.5 * eased;

      setDisplayText((prev) => updatePartialRandom(prev, changeRate, prev));

      if (progress >= 1) {
        setPhase("trans-top");
        return;
      }

      const currentSpeed = startSpeed - (startSpeed - endSpeed) * eased;
      timeoutId = setTimeout(tick, currentSpeed);
    };

    tick();
    return () => clearTimeout(timeoutId);
  }, [phase, transScrambleDuration, randomSpeed, updatePartialRandom]);

  // トランジション2: トップスピード（ここで文字数を新テキストに合わせる）
  useEffect(() => {
    if (phase !== "trans-top") return;

    const startTime = Date.now();
    let timeoutId: NodeJS.Timeout;
    let lengthAdjusted = false;

    const tick = () => {
      const elapsed = Date.now() - startTime;

      setDisplayText((prev) => {
        let current = prev;

        // 最初のtickで文字数を調整
        if (!lengthAdjusted) {
          lengthAdjusted = true;
          const targetLen = targetText.length;
          const currentLen = current.length;

          if (targetLen > currentLen) {
            // 文字を追加
            current = current + generateRandomText(targetLen - currentLen);
          } else if (targetLen < currentLen) {
            // 文字を削除
            current = current.slice(0, targetLen);
          }
        }

        // ランダム更新
        return current
          .split("")
          .map((char) => {
            if (Math.random() < 0.6) {
              return getRandomChar();
            }
            return char;
          })
          .join("");
      });

      if (elapsed >= transTopDuration) {
        setPhase("trans-decode");
        return;
      }

      timeoutId = setTimeout(tick, randomSpeed);
    };

    tick();
    return () => clearTimeout(timeoutId);
  }, [phase, transTopDuration, randomSpeed, targetText, generateRandomText, getRandomChar]);

  // トランジション3: デコード（新テキストへ）
  useEffect(() => {
    if (phase !== "trans-decode") return;

    const startTime = Date.now();
    let timeoutId: NodeJS.Timeout;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / transDecodeDuration, 1);
      const eased = progress * progress;
      const confirmedCount = Math.floor(eased * targetText.length);

      setDisplayText((prev) =>
        targetText
          .split("")
          .map((char, index) => {
            if (char === " " || char === "　") return char;
            if (index < confirmedCount) return char;
            if (Math.random() < 0.6) {
              return getRandomChar();
            }
            return prev[index] || getRandomChar();
          })
          .join("")
      );

      if (progress >= 1) {
        setDisplayText(targetText);
        setPhase("done");
        return;
      }

      timeoutId = setTimeout(tick, randomSpeed);
    };

    tick();
    return () => clearTimeout(timeoutId);
  }, [phase, targetText, transDecodeDuration, randomSpeed, getRandomChar]);

  return { displayText, isGlitching, startTransition };
}
