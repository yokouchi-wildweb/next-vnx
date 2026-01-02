"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/cn";

const VARIANT_CLASSES = {
  neon: "text-gradient-neon gradient-90",
  mono: "text-gradient-mono gradient-90",
} as const;

const CARET_CLASSES = {
  neon: "bg-gradient-neon gradient-180",
  mono: "bg-gradient-mono gradient-180",
} as const;

type TypingTextProps = {
  text: string;
  /** グラデーションバリアント */
  variant?: keyof typeof VARIANT_CLASSES;
  /** タイピング速度（ミリ秒/文字） */
  speed?: number;
  /** 開始までの遅延（ミリ秒） */
  delay?: number;
  /** 追加のクラス名 */
  className?: string;
};

/** タイピングアニメーション付きグラデーションテキスト */
export function TypingText({
  text,
  variant = "neon",
  speed = 80,
  delay = 500,
  className,
}: TypingTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    let timeoutId: NodeJS.Timeout;

    // 開始遅延
    const startTimeout = setTimeout(() => {
      const typeNextChar = () => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
          timeoutId = setTimeout(typeNextChar, speed);
        } else {
          setIsTypingComplete(true);
        }
      };
      typeNextChar();
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(timeoutId);
    };
  }, [text, speed, delay]);

  return (
    <span className={cn("inline-flex items-center", className)}>
      {/* グラデーションテキスト */}
      <span className={cn("font-medium", VARIANT_CLASSES[variant])}>
        {displayedText}
      </span>
      {/* キャレット（点滅） */}
      <span
        className={cn(
          "inline-block w-[2px] h-[1.1em] ml-0.5",
          CARET_CLASSES[variant],
          isTypingComplete && "animate-caret-blink"
        )}
      />
    </span>
  );
}
