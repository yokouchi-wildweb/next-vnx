"use client";

type HeartbeatWaveProps = {
  className?: string;
  /** 波形の色 */
  color?: string;
  /** 線の太さ */
  strokeWidth?: number;
  /** 1サイクルの時間（心拍間隔） */
  duration?: string;
  /** 発光エフェクトを有効にするか */
  glow?: boolean;
  /** ピーク（QRS群）の高さ（上方向、デフォルト30） */
  peakHeight?: number;
  /** ピーク（QRS群）の深さ（下方向、デフォルト15） */
  peakDepth?: number;
};

/**
 * 心電図のような波形アニメーション
 *
 * stroke-dashoffsetを使用して波形が流れるように描画
 * 定期的に脈動するECG風のビジュアル
 */
export function HeartbeatWave({
  className = "",
  color = "#8c2283",
  strokeWidth = 2,
  duration = "2s",
  glow = true,
  peakHeight = 30,
  peakDepth = 24,
}: HeartbeatWaveProps) {
  // viewBox設定（ピークサイズに応じて高さを調整）
  const width = 300;
  const height = Math.max(60, peakHeight * 2 + 20);
  const centerY = height / 2;

  // 心電図波形のパス（1サイクル分を2回繰り返し）
  // P波 → QRS群（大きなスパイク）→ T波 → ベースライン
  const createHeartbeatPath = (startX: number) => {
    const x = startX;
    // P波とT波の高さもピークに比例してスケール
    const pWaveHeight = Math.max(5, peakHeight * 0.17);
    const tWaveHeight = Math.max(8, peakHeight * 0.27);

    return `
      M ${x} ${centerY}
      L ${x + 10} ${centerY}

      Q ${x + 15} ${centerY} ${x + 18} ${centerY - pWaveHeight}
      Q ${x + 21} ${centerY - pWaveHeight * 2} ${x + 24} ${centerY}

      L ${x + 30} ${centerY}

      L ${x + 33} ${centerY + 5}
      L ${x + 36} ${centerY - peakHeight}
      L ${x + 42} ${centerY + peakDepth}
      L ${x + 45} ${centerY}

      L ${x + 55} ${centerY}

      Q ${x + 60} ${centerY} ${x + 65} ${centerY - tWaveHeight}
      Q ${x + 70} ${centerY - tWaveHeight * 1.5} ${x + 75} ${centerY}

      L ${x + 100} ${centerY}
    `;
  };

  // 3サイクル分の波形を連結
  const fullPath = `
    ${createHeartbeatPath(0)}
    ${createHeartbeatPath(100).replace("M", "L")}
    ${createHeartbeatPath(200).replace("M", "L")}
  `;

  // パスの総長（概算）
  const pathLength = 900;

  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {glow && (
          <filter id="heartbeatGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>

      {/* 背景の薄い波形（トレイル効果） */}
      <path
        d={fullPath}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.2"
      />

      {/* メインの波形（アニメーション） */}
      <path
        d={fullPath}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={glow ? "url(#heartbeatGlow)" : undefined}
        strokeDasharray={`${pathLength / 3} ${(pathLength / 3) * 2}`}
      >
        <animate
          attributeName="stroke-dashoffset"
          values={`${pathLength / 3}; ${-pathLength / 3 * 2}`}
          dur={duration}
          repeatCount="indefinite"
          calcMode="linear"
        />
        {/* 脈動時の明るさ変化 */}
        <animate
          attributeName="opacity"
          values="0.6; 1; 0.6"
          keyTimes="0; 0.3; 1"
          dur={duration}
          repeatCount="indefinite"
        />
      </path>

      {/* ピーク時の強調光 */}
      <circle r="4" fill={color} opacity="0">
        <animate
          attributeName="opacity"
          values="0; 0.8; 0"
          keyTimes="0; 0.15; 0.4"
          dur={duration}
          repeatCount="indefinite"
        />
        <animate
          attributeName="cx"
          values="36; 136; 236"
          dur={duration}
          repeatCount="indefinite"
          calcMode="discrete"
          keyTimes="0; 0.33; 0.66"
        />
        <animate
          attributeName="cy"
          values={`${centerY - 30}; ${centerY - 30}; ${centerY - 30}`}
          dur={duration}
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}
