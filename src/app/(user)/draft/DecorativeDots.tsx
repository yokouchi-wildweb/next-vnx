"use client";

type DecorativeDotsProps = {
  className?: string;
};

/**
 * 9個のドットが形状モーフィングするSVGアニメーション
 *
 * 形状パターン:
 * 1. 正方形 (3x3グリッド)
 * 2. 円形
 * 3. 三角形
 * 4. ダイヤモンド
 * 5. 正方形に戻る
 */
export function DecorativeDots({ className = "" }: DecorativeDotsProps) {
  // 各形状でのドット位置 (cx, cy)
  // viewBox: 0 0 160 160、中心: 80, 80

  // 正方形 (3x3グリッド)
  const square = [
    [40, 40], [80, 40], [120, 40],
    [40, 80], [80, 80], [120, 80],
    [40, 120], [80, 120], [120, 120],
  ];

  // 円形
  const circle = [
    [80, 30],   // 上
    [122, 45],  // 右上
    [137, 80],  // 右
    [122, 115], // 右下
    [80, 130],  // 下
    [38, 115],  // 左下
    [23, 80],   // 左
    [38, 45],   // 左上
    [80, 80],   // 中心
  ];

  // 三角形 (上向き)
  const triangle = [
    [80, 25],   // 頂点
    [60, 55], [100, 55],  // 2段目
    [40, 85], [80, 85], [120, 85],  // 3段目
    [50, 115], [80, 115], [110, 115],  // 底辺
  ];

  // ダイヤモンド (ひし形)
  const diamond = [
    [80, 20],   // 上
    [55, 50], [105, 50],  // 上段
    [30, 80], [80, 80], [130, 80],  // 中段
    [55, 110], [105, 110],  // 下段
    [80, 140],  // 下
  ];

  const dur = "6s"; // 全体のアニメーション時間
  const dotSize = 10;
  const dotOpacity = 0.65;

  // 各ドットのアニメーション値を生成
  const generateValues = (dotIndex: number, attr: "cx" | "cy") => {
    const idx = attr === "cx" ? 0 : 1;
    return `${square[dotIndex][idx]}; ${circle[dotIndex][idx]}; ${triangle[dotIndex][idx]}; ${diamond[dotIndex][idx]}; ${square[dotIndex][idx]}`;
  };

  // キータイム: 各形状での滞在時間を均等に
  const keyTimes = "0; 0.25; 0.5; 0.75; 1";

  return (
    <svg
      className={className}
      width="160"
      height="160"
      viewBox="0 0 160 160"
      fill="none"
    >
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <circle
          key={i}
          cx={square[i][0]}
          cy={square[i][1]}
          r={dotSize}
          fill={`rgba(255,255,255,${dotOpacity})`}
        >
          <animate
            attributeName="cx"
            values={generateValues(i, "cx")}
            keyTimes={keyTimes}
            dur={dur}
            calcMode="spline"
            keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1"
            repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            values={generateValues(i, "cy")}
            keyTimes={keyTimes}
            dur={dur}
            calcMode="spline"
            keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1"
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
  );
}
