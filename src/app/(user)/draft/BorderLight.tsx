"use client";

type LightRunner = {
  /** 1周にかかる時間（例: "4s", "6s"） */
  duration: string;
  /** 光のサイズ */
  size: number;
  /** 光の色 */
  color: string;
  /** 透明度（0-1） */
  opacity?: number;
  /** 開始遅延（負の値で先行スタート、例: "-2s"） */
  delay?: string;
  /** 呼吸アニメーション設定（省略時は無効） */
  breathe?: {
    /** 最小サイズ（倍率、例: 0.5 = 50%） */
    min: number;
    /** 最大サイズ（倍率、例: 1.5 = 150%） */
    max: number;
    /** 呼吸1サイクルの時間（例: "2s"） */
    duration: string;
  };
};

type BorderLightProps = {
  className?: string;
  /** ボーダーの内側オフセット（inset-3 = 12px相当） */
  inset?: number;
  /** 角丸の半径（rounded-xl = 12px相当） */
  borderRadius?: number;
  /** 光のランナー設定（配列で複数指定可能） */
  runners?: LightRunner[];
};

/** デフォルトのランナー設定 */
const defaultRunners: LightRunner[] = [
  {
    duration: "12s",
    size: 8,
    color: "#ffffff",
    opacity: 0.5,
    delay: "0s",
    breathe: { min: 0.8, max: 1.2, duration: "2s" },
  },
  {
    duration: "6s",
    size: 3,
    color: "#ffffff",
    opacity: 1,
    delay: "-6s",
    breathe: { min: 0.9, max: 2.1, duration: "1.5s" },
  },
];

/**
 * ボーダーに沿って光が走るSVGアニメーション
 *
 * animateMotionを使用して、角丸の長方形パスに沿って
 * 発光するポイントを周回させる
 */
export function BorderLight({
  className = "",
  inset = 12,
  borderRadius = 12,
  runners = defaultRunners,
}: BorderLightProps) {
  // SVGのviewBox全体のサイズ（実際のサイズはCSSで制御）
  const viewBoxWidth = 1000;
  const viewBoxHeight = 562; // 16:9 aspect ratio

  // insetを考慮した描画領域
  const x = inset;
  const y = inset;
  const w = viewBoxWidth - inset * 2;
  const h = viewBoxHeight - inset * 2;
  const r = borderRadius;

  // 角丸長方形のパス（時計回り）
  const path = `
    M ${x + r} ${y}
    L ${x + w - r} ${y}
    Q ${x + w} ${y} ${x + w} ${y + r}
    L ${x + w} ${y + h - r}
    Q ${x + w} ${y + h} ${x + w - r} ${y + h}
    L ${x + r} ${y + h}
    Q ${x} ${y + h} ${x} ${y + h - r}
    L ${x} ${y + r}
    Q ${x} ${y} ${x + r} ${y}
    Z
  `;

  return (
    <svg
      className={className}
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      fill="none"
      preserveAspectRatio="none"
    >
      <defs>
        {/* 発光エフェクト用のフィルター */}
        <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" result="blur1" />
          <feGaussianBlur stdDeviation="8" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* 各ランナー用のグラデーション */}
        {runners.map((runner, i) => (
          <radialGradient key={`gradient-${i}`} id={`lightGradient-${i}`}>
            <stop offset="0%" stopColor={runner.color} stopOpacity="1" />
            <stop offset="50%" stopColor={runner.color} stopOpacity="0.6" />
            <stop offset="100%" stopColor={runner.color} stopOpacity="0" />
          </radialGradient>
        ))}

        {/* 移動パス（非表示） */}
        <path id="borderPath" d={path} />
      </defs>

      {/* ランナーを動的に生成 */}
      {runners.map((runner, i) => {
        const minR = runner.size * (runner.breathe?.min ?? 1);
        const maxR = runner.size * (runner.breathe?.max ?? 1);

        return (
          <circle
            key={i}
            r={runner.size}
            fill={`url(#lightGradient-${i})`}
            fillOpacity={runner.opacity ?? 1}
            filter="url(#glow)"
          >
            {/* パスに沿った移動 */}
            <animateMotion
              dur={runner.duration}
              repeatCount="indefinite"
              rotate="auto"
              begin={runner.delay ?? "0s"}
            >
              <mpath href="#borderPath" />
            </animateMotion>

            {/* 呼吸アニメーション（設定がある場合のみ） */}
            {runner.breathe && (
              <animate
                attributeName="r"
                values={`${runner.size}; ${maxR}; ${runner.size}; ${minR}; ${runner.size}`}
                keyTimes="0; 0.25; 0.5; 0.75; 1"
                dur={runner.breathe.duration}
                calcMode="spline"
                keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1"
                repeatCount="indefinite"
              />
            )}
          </circle>
        );
      })}
    </svg>
  );
}
