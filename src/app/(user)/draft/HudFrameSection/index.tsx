"use client";

import { cn } from "@/lib/cn";

// コーナー装飾コンポーネント
function CornerDecoration({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const positionClasses = {
    tl: "top-0 left-0 border-t-2 border-l-2 rounded-tl-xl",
    tr: "top-0 right-0 border-t-2 border-r-2 rounded-tr-xl",
    bl: "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-xl",
    br: "bottom-0 right-0 border-b-2 border-r-2 rounded-br-xl",
  };

  return (
    <div
      className={cn(
        "absolute w-6 h-6 md:w-8 md:h-8",
        "border-cyan-400/60",
        positionClasses[position]
      )}
    >
      {/* 内側のドット */}
      <div
        className={cn(
          "absolute w-1.5 h-1.5 rounded-full bg-cyan-400/80",
          "animate-pulse-slow",
          position === "tl" && "top-1 left-1",
          position === "tr" && "top-1 right-1",
          position === "bl" && "bottom-1 left-1",
          position === "br" && "bottom-1 right-1"
        )}
      />
    </div>
  );
}

// タイトルバー
function TitleBar() {
  return (
    <div className="relative flex items-center justify-between px-4 md:px-6 py-3 border-b border-cyan-500/20">
      {/* 左側: アイコン + タイトル */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-cyan-400 text-lg">◈</span>
          <span className="text-xs md:text-sm font-mono tracking-widest text-cyan-300/80">
            NEXT-VNX
          </span>
        </div>
        <div className="hidden md:block w-px h-4 bg-cyan-500/30" />
        <span className="hidden md:block text-xs font-mono text-white/40">
          SYSTEM.OVERVIEW
        </span>
      </div>

      {/* 右側: ウィンドウコントロール風 */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1.5">
          {["pink", "cyan", "purple"].map((color, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 md:w-2.5 md:h-2.5 rounded-full",
                color === "pink" && "bg-pink-400/60",
                color === "cyan" && "bg-cyan-400/60",
                color === "purple" && "bg-purple-400/60"
              )}
              style={{
                boxShadow: `0 0 6px ${
                  color === "pink"
                    ? "rgba(244, 114, 182, 0.5)"
                    : color === "cyan"
                    ? "rgba(6, 182, 212, 0.5)"
                    : "rgba(168, 85, 247, 0.5)"
                }`,
              }}
            />
          ))}
        </div>
        <span className="text-cyan-400/60 text-sm ml-2">✦</span>
      </div>
    </div>
  );
}

// ステータスバー
function StatusBar() {
  return (
    <div className="relative flex items-center justify-between px-4 md:px-6 py-2.5 border-t border-cyan-500/20">
      {/* 左側: ステータス */}
      <div className="flex items-center gap-2">
        <span className="text-cyan-400/80 text-xs">▸</span>
        <span className="text-xs font-mono text-white/50 tracking-wide">
          CREATIVE_MODE
        </span>
        <span className="text-cyan-400/40 text-xs">|</span>
        <span className="text-xs font-mono text-cyan-400/60">ONLINE</span>
      </div>

      {/* 右側: プログレスバー風 */}
      <div className="flex items-center gap-3">
        <div className="relative w-24 md:w-32 h-1 bg-cyan-950/50 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full animate-status-progress"
            style={{ width: "100%" }}
          />
          {/* 光のスキャン */}
          <div className="absolute inset-0 animate-status-scan">
            <div className="w-8 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>
        </div>
        <span className="text-xs font-mono text-purple-400/60">✦</span>
      </div>
    </div>
  );
}

// メインコンテンツ
function MainContent() {
  return (
    <div className="relative px-6 md:px-12 py-12 md:py-16">
      {/* 背景のグリッドパターン */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      {/* コンテンツ */}
      <div className="relative text-center space-y-6 md:space-y-8">
        {/* メインタイトル */}
        <h2
          className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-wide"
          style={{
            background: "linear-gradient(135deg, #22d3ee 0%, #a78bfa 50%, #f472b6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 20px rgba(139, 92, 246, 0.3))",
          }}
        >
          Next VNXでできること
        </h2>

        {/* 装飾ライン */}
        <div className="flex items-center justify-center gap-3">
          <div className="w-8 md:w-12 h-px bg-gradient-to-r from-transparent to-cyan-400/60" />
          <span className="text-cyan-400/60 text-sm">◇</span>
          <div className="w-8 md:w-12 h-px bg-gradient-to-l from-transparent to-cyan-400/60" />
        </div>

        {/* 説明文 */}
        <div className="space-y-3 md:space-y-4 max-w-2xl mx-auto">
          <p className="text-lg md:text-2xl text-white/90 font-light tracking-wide">
            誰もが物語のクリエイターに
          </p>
          <p className="text-sm md:text-base text-white/50 tracking-wider">
            ノベルゲーム / マーダーミステリー
          </p>
          <p className="text-base md:text-lg text-white/70">
            思い通りにシナリオ創作
          </p>
          <p className="text-base md:text-lg text-white/70">
            あなたのアイデアを実現する
          </p>
          <p
            className="text-lg md:text-xl text-cyan-300/90 font-medium tracking-wide pt-2"
            style={{
              textShadow: "0 0 20px rgba(6, 182, 212, 0.4)",
            }}
          >
            次世代の創作スタジオ
          </p>
        </div>
      </div>

      {/* 浮遊する装飾 */}
      <div className="absolute top-8 left-8 text-cyan-400/20 text-xs font-mono animate-float-particle">
        ✦
      </div>
      <div
        className="absolute top-12 right-12 text-purple-400/20 text-sm animate-float-particle"
        style={{ animationDelay: "1s" }}
      >
        ◇
      </div>
      <div
        className="absolute bottom-8 left-16 text-pink-400/20 text-xs animate-float-particle"
        style={{ animationDelay: "2s" }}
      >
        ✧
      </div>
      <div
        className="absolute bottom-12 right-8 text-cyan-400/20 text-xs font-mono animate-float-particle"
        style={{ animationDelay: "1.5s" }}
      >
        ◈
      </div>
    </div>
  );
}

export function HudFrameSection() {
  return (
    <section className="relative py-8 md:py-16 px-4">
      <div className="relative mx-auto max-w-5xl">
        {/* 外側のグロー */}
        <div
          className="absolute -inset-1 rounded-2xl opacity-50 blur-xl"
          style={{
            background: "linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(168, 85, 247, 0.15), rgba(244, 114, 182, 0.1))",
          }}
        />

        {/* メインフレーム */}
        <div
          className={cn(
            "relative rounded-2xl overflow-hidden",
            "border border-cyan-500/30",
            "bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-purple-950/30",
            "backdrop-blur-md"
          )}
          style={{
            boxShadow: `
              0 0 0 1px rgba(6, 182, 212, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.05),
              0 20px 50px -20px rgba(0, 0, 0, 0.5)
            `,
          }}
        >
          {/* 内側の装飾ボーダー */}
          <div className="absolute inset-2 md:inset-3 rounded-xl border border-cyan-500/10 pointer-events-none" />

          {/* コーナー装飾 */}
          <CornerDecoration position="tl" />
          <CornerDecoration position="tr" />
          <CornerDecoration position="bl" />
          <CornerDecoration position="br" />

          {/* スキャンライン効果 */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.02]"
            style={{
              background: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(255, 255, 255, 0.5) 2px,
                rgba(255, 255, 255, 0.5) 4px
              )`,
            }}
          />

          {/* 上部ライトエフェクト */}
          <div
            className="absolute top-0 left-1/4 right-1/4 h-px"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.5), transparent)",
            }}
          />

          {/* コンテンツ */}
          <TitleBar />
          <MainContent />
          <StatusBar />
        </div>

        {/* 下部の反射 */}
        <div
          className="absolute -bottom-4 left-1/4 right-1/4 h-8 rounded-full blur-2xl opacity-20"
          style={{
            background: "linear-gradient(90deg, rgba(6, 182, 212, 0.5), rgba(168, 85, 247, 0.5))",
          }}
        />
      </div>
    </section>
  );
}
