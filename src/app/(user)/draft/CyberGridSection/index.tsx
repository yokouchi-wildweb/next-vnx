"use client";

import { cn } from "@/lib/cn";
import { SectionTitle } from "../SectionTitle";

// 浮遊キーワード
const FLOATING_KEYWORDS = [
  { text: "AI", x: 15, y: 20, size: "text-xs", delay: 0 },
  { text: "Live2D", x: 80, y: 15, size: "text-sm", delay: 0.5 },
  { text: "WebGL", x: 25, y: 75, size: "text-xs", delay: 1 },
  { text: "TTS", x: 70, y: 80, size: "text-xs", delay: 1.5 },
  { text: "NEXT", x: 10, y: 50, size: "text-sm", delay: 2 },
  { text: "VN", x: 85, y: 45, size: "text-xs", delay: 2.5 },
  { text: "ENGINE", x: 50, y: 10, size: "text-xs", delay: 3 },
  { text: "STORY", x: 45, y: 85, size: "text-xs", delay: 3.5 },
];

// グリッドコンテンツ
const GRID_ITEMS = [
  {
    id: 1,
    title: "CREATE",
    description: "直感的なエディタで、コード不要でビジュアルノベルを制作",
    icon: "✦",
  },
  {
    id: 2,
    title: "GENERATE",
    description: "AIがストーリー、キャラクター、背景を自動生成",
    icon: "◈",
  },
  {
    id: 3,
    title: "PUBLISH",
    description: "ワンクリックでWeb、モバイル、デスクトップに展開",
    icon: "◇",
  },
];

function PerspectiveGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* 水平グリッドライン（遠近法） */}
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <defs>
          {/* ネオングロー */}
          <filter id="neonGlow">
            <feGaussianBlur stdDeviation="0.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* グラデーション */}
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(6, 182, 212, 0)" />
            <stop offset="50%" stopColor="rgba(6, 182, 212, 0.6)" />
            <stop offset="100%" stopColor="rgba(6, 182, 212, 0)" />
          </linearGradient>
          <linearGradient id="verticalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(6, 182, 212, 0.4)" />
            <stop offset="100%" stopColor="rgba(6, 182, 212, 0)" />
          </linearGradient>
        </defs>

        {/* 消失点に向かう水平線 */}
        {[...Array(12)].map((_, i) => {
          const y = 30 + i * 6; // 30%から始まる
          const perspective = Math.pow(i / 12, 1.5); // 遠近法の強度
          const x1 = 50 - (50 - perspective * 30);
          const x2 = 50 + (50 - perspective * 30);
          const opacity = 0.15 + perspective * 0.3;
          return (
            <line
              key={`h-${i}`}
              x1={x1}
              y1={y}
              x2={x2}
              y2={y}
              stroke="url(#lineGradient)"
              strokeWidth={0.15 + perspective * 0.1}
              opacity={opacity}
              filter="url(#neonGlow)"
            />
          );
        })}

        {/* 垂直線（消失点に向かって収束） */}
        {[...Array(15)].map((_, i) => {
          const xBottom = (i / 14) * 100;
          const xTop = 50 + (xBottom - 50) * 0.2; // 上に行くほど中央に収束
          return (
            <line
              key={`v-${i}`}
              x1={xBottom}
              y1={100}
              x2={xTop}
              y2={30}
              stroke="url(#verticalGradient)"
              strokeWidth={0.1}
              opacity={0.3}
            />
          );
        })}
      </svg>

      {/* 走査線アニメーション */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-grid-scan"
          style={{ top: "30%" }}
        />
      </div>
    </div>
  );
}

function FloatingKeyword({
  text,
  x,
  y,
  size,
  delay,
}: {
  text: string;
  x: number;
  y: number;
  size: string;
  delay: number;
}) {
  return (
    <div
      className={cn(
        "absolute font-mono tracking-widest animate-keyword-float",
        size,
        "text-cyan-400/40"
      )}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animationDelay: `${delay}s`,
        textShadow: "0 0 10px rgba(6, 182, 212, 0.5)",
      }}
    >
      {text}
    </div>
  );
}

function GridCard({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: string;
  index: number;
}) {
  return (
    <div
      className={cn(
        "group relative p-6 rounded-lg",
        "border border-cyan-500/20",
        "bg-gradient-to-br from-cyan-950/30 to-transparent",
        "backdrop-blur-sm",
        "transition-all duration-500",
        "hover:border-cyan-400/50 hover:bg-cyan-950/40",
        "hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]"
      )}
      style={{
        animationDelay: `${index * 150}ms`,
      }}
    >
      {/* パルスボーダー */}
      <div
        className={cn(
          "absolute inset-0 rounded-lg opacity-0 transition-opacity duration-500",
          "group-hover:opacity-100"
        )}
        style={{
          background: `
            linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.3), transparent) top / 200% 1px no-repeat,
            linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.3), transparent) bottom / 200% 1px no-repeat,
            linear-gradient(0deg, transparent, rgba(6, 182, 212, 0.3), transparent) left / 1px 200% no-repeat,
            linear-gradient(0deg, transparent, rgba(6, 182, 212, 0.3), transparent) right / 1px 200% no-repeat
          `,
          animation: "border-pulse 2s linear infinite",
        }}
      />

      {/* アイコン */}
      <div className="text-3xl text-cyan-400 mb-4 animate-pulse-slow">
        {icon}
      </div>

      {/* タイトル */}
      <h3
        className="text-xl font-bold mb-2 tracking-wider"
        style={{
          background: "linear-gradient(135deg, #22d3ee, #a5f3fc)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {title}
      </h3>

      {/* 説明 */}
      <p className="text-white/60 text-sm leading-relaxed">
        {description}
      </p>

      {/* コーナーアクセント */}
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-cyan-400/30 rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-cyan-400/30 rounded-bl-lg" />
    </div>
  );
}

export function CyberGridSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* 遠近法グリッド背景 */}
      <PerspectiveGrid />

      {/* 浮遊キーワード */}
      <div className="absolute inset-0 pointer-events-none">
        {FLOATING_KEYWORDS.map((keyword, i) => (
          <FloatingKeyword key={i} {...keyword} />
        ))}
      </div>

      {/* コンテンツ */}
      <div className="relative z-10">
        {/* セクションタイトル */}
        <SectionTitle
          title="Vision"
          subtitle="私たちが目指す未来"
          color="cyan"
          size="lg"
          className="mb-16 md:mb-24"
        />

        {/* グリッドカード */}
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {GRID_ITEMS.map((item, index) => (
              <GridCard
                key={item.id}
                title={item.title}
                description={item.description}
                icon={item.icon}
                index={index}
              />
            ))}
          </div>

          {/* 中央のキャッチコピー */}
          <div className="mt-16 text-center">
            <p
              className="inline-block text-lg md:text-xl text-white/80 font-light tracking-wide px-8 py-4 rounded-lg border border-cyan-500/20 bg-cyan-950/20 backdrop-blur-sm"
              style={{
                textShadow: "0 0 20px rgba(6, 182, 212, 0.3)",
              }}
            >
              <span className="text-cyan-400">&lt;</span>
              {" "}物語を創る、すべての人へ {" "}
              <span className="text-cyan-400">/&gt;</span>
            </p>
          </div>
        </div>
      </div>

      {/* 下部のグラデーションフェード */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
    </section>
  );
}
