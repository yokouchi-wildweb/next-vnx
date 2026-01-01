export function ServiceAboutSection() {
  return (
    <section className="relative py-16 md:py-24">
      {/* 浮き上がったパネル */}
      <div className="relative mx-auto px-1">
        <div
          className="relative rounded-2xl p-8 md:p-12 overflow-visible"
          style={{
            // シアン→ピンクのグラデーション背景
            background: "linear-gradient(135deg, oklch(0.7 0.15 200) 0%, oklch(0.75 0.18 350) 100%)",
            // 浮き上がり効果（シャドウ）
            boxShadow: `
              0 25px 50px -12px rgba(0, 0, 0, 0.4),
              0 0 60px rgba(6, 182, 212, 0.15),
              0 0 60px rgba(244, 114, 182, 0.15)
            `,
          }}
        >
          {/* 内側の白いボーダーライン + ドットパターン */}
          <div
            className="absolute inset-4 rounded-xl pointer-events-none"
            style={{
              border: "1px solid rgba(255, 255, 255, 0.5)",
              backgroundImage: "radial-gradient(circle, rgba(255, 255, 255, 0.66) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          />

          {/* コンテンツエリア */}
          <div className="relative">
            {/* セクションタイトル */}
            <div className="text-center">
              <h2 className="inline-flex items-center gap-4 md:gap-6 px-8 py-3 bg-white rounded-full">
                {/* 左装飾ライン */}
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_2px_rgba(192,132,252,0.6)]" />
                  <span className="w-8 md:w-16 h-0.5 bg-gradient-to-r from-purple-400 to-transparent shadow-[0_0_8px_rgba(192,132,252,0.5)]" />
                </span>

                {/* グラデーションテキスト */}
                <span
                  className="text-2xl md:text-3xl font-bold tracking-wider"
                  style={{
                    background: "linear-gradient(135deg, oklch(0.7 0.2 280), oklch(0.85 0.15 300), oklch(0.7 0.2 280))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(0 0 20px rgba(192, 132, 252, 0.5)) drop-shadow(0 0 40px rgba(192, 132, 252, 0.3))",
                  }}
                >
                  このサービスについて
                </span>

                {/* 右装飾ライン */}
                <span className="flex items-center gap-1.5">
                  <span className="w-8 md:w-16 h-0.5 bg-gradient-to-l from-purple-400 to-transparent shadow-[0_0_8px_rgba(192,132,252,0.5)]" />
                  <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_2px_rgba(192,132,252,0.6)]" />
                </span>
              </h2>
            </div>

            {/* コンテンツ：左画像 + 右テキスト */}
            <div className="mt-3 flex flex-col md:flex-row items-center gap-4 md:gap-0">
              {/* 左：画像（コンテナから飛び出し） */}
              <div className="flex-shrink-0 w-full md:w-[50%] md:-ml-12 lg:-ml-18">
                <img
                  src="/assets/imgs/laptop.png"
                  alt="創作スタジオ"
                  className="w-full h-auto drop-shadow-2xl scale-110 md:scale-125"
                  style={{
                    filter: "drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3))",
                  }}
                />
              </div>

              {/* 右：テキスト（前面に表示） */}
              <div
                className="relative z-10 flex-1 text-white font-bold text-center space-y-6"
                style={{
                  textShadow: `
                    0 0 30px rgba(255, 255, 255, 0.7),
                    0 0 60px rgba(255, 255, 255, 0.4),
                    0 4px 12px rgba(0, 0, 0, 0.3)
                  `,
                }}
              >
                <p className="text-2xl md:text-3xl lg:text-4xl leading-relaxed">
                  「Next VNX」で<br />
                  誰もが物語のクリエイター
                </p>
                <p className="text-base md:text-lg lg:text-xl leading-relaxed">
                  このサービスは、ノベルゲームやマーダーミステリーといった
                  "物語体験"を生み出すための、次世代型・創作スタジオです。
                </p>
                <p className="text-base md:text-lg lg:text-xl leading-relaxed">
                  頭の中にあるアイデアや設定、キャラクター、伏線。
                  それらを、難しい知識や複雑なツールに縛られることなく、
                  思い通りのシナリオとして形にできます。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
