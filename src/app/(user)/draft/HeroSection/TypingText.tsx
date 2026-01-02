"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/cn";

const GRADIENT_VARIANTS = {
  neon: {
    text: "linear-gradient(90deg, oklch(0.70 0.25 330), oklch(0.65 0.20 280), oklch(0.75 0.18 195))",
    caret: "linear-gradient(180deg, oklch(0.70 0.25 330), oklch(0.75 0.18 195))",
  },
  mono: {
    text: "linear-gradient(90deg, oklch(0.45 0 0), oklch(0.55 0 0), oklch(0.65 0 0))",
    caret: "linear-gradient(180deg, oklch(0.45 0 0), oklch(0.65 0 0))",
  },
} as const;

type TypingTextProps = {
  text: string;
  /** グラデーションバリアント */
  variant?: keyof typeof GRADIENT_VARIANTS;
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
  const gradient = GRADIENT_VARIANTS[variant];
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
    <>
      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .caret-blink {
          animation: blink 1s infinite;
        }
      `}</style>
      <span className={cn("inline-flex items-center", className)}>
        {/* グラデーションテキスト */}
        <span
          className="bg-clip-text text-transparent font-medium"
          style={{
            backgroundImage: gradient.text,
          }}
        >
          {displayedText}
        </span>
        {/* キャレット（点滅） */}
        <span
          className={cn(
            "inline-block w-[2px] h-[1.1em] ml-0.5",
            isTypingComplete && "caret-blink"
          )}
          style={{
            background: gradient.caret,
          }}
        />
      </span>
    </>
  );
}
