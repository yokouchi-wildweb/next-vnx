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
 * 4. X型 (0度)
 * 5. X型 (90度) - 時計回りに回転
 * 6. X型 (270度) - 逆回転して振り子のように
 * 7. ダイヤモンド
 * 8. 正方形に戻る
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

  // X型 (バツ印) - 対角線上に配置 (0度)
  const cross0 = [
    [25, 25],   // 左上
    [55, 55],   // 左上→中心
    [135, 25],  // 右上
    [105, 55],  // 右上→中心
    [80, 80],   // 中心
    [55, 105],  // 左下→中心
    [25, 135],  // 左下
    [105, 105], // 右下→中心
    [135, 135], // 右下
  ];

  // X型 90度回転（中心(80,80)を軸に時計回り）
  const cross90 = [
    [135, 25],  // ドット0: 左上→右上
    [105, 55],  // ドット1
    [135, 135], // ドット2: 右上→右下
    [105, 105], // ドット3
    [80, 80],   // ドット4: 中心
    [55, 55],   // ドット5
    [25, 25],   // ドット6: 左下→左上
    [55, 105],  // ドット7
    [25, 135],  // ドット8: 右下→左下
  ];

  // X型 270度回転（-90度、反対側）
  const cross270 = [
    [25, 135],  // ドット0: 左上→左下
    [55, 105],  // ドット1
    [25, 25],   // ドット2: 右上→左上
    [55, 55],   // ドット3
    [80, 80],   // ドット4: 中心
    [105, 105], // ドット5
    [135, 135], // ドット6: 左下→右下
    [105, 55],  // ドット7
    [135, 25],  // ドット8: 右下→右上
  ];

  // ダイヤモンド (ひし形)
  const diamond = [
    [80, 20],   // 上
    [55, 50], [105, 50],  // 上段
    [30, 80], [80, 80], [130, 80],  // 中段
    [55, 110], [105, 110],  // 下段
    [80, 140],  // 下
  ];

  const dotSize = 10;
  const dotOpacity = 0.65;

  const shapes = [square, circle, triangle, cross0, cross90, cross270, diamond, square];
  const transitionCount = shapes.length - 1; // 7回の遷移

  // 時間設定
  const waitSeconds = 1; // 各形状での停止時間（秒）
  const transitionSeconds = 10 / transitionCount; // 元の遷移速度を維持（≈1.43秒）

  // 全体時間を動的に計算
  const totalSeconds = waitSeconds * transitionCount + transitionSeconds * transitionCount;
  const dur = `${totalSeconds}s`;

  // 比率計算
  const waitRatio = waitSeconds / totalSeconds;
  const transitionRatio = transitionSeconds / totalSeconds;

  // 各ドットのアニメーション値を生成（各形状を2回入れて停止を表現）
  const generateValues = (dotIndex: number, attr: "cx" | "cy") => {
    const idx = attr === "cx" ? 0 : 1;
    return shapes
      .flatMap((shape, i) =>
        i < shapes.length - 1
          ? [shape[dotIndex][idx], shape[dotIndex][idx]]
          : [shape[dotIndex][idx]]
      )
      .join("; ");
  };

  // keyTimes生成（各形状で2点：到達時と停止終了時）
  const generateKeyTimes = () => {
    const times: number[] = [];
    let current = 0;

    for (let i = 0; i < shapes.length; i++) {
      times.push(current);
      if (i < shapes.length - 1) {
        current += waitRatio;
        times.push(current);
        current += transitionRatio;
      }
    }
    return times.map((t) => t.toFixed(3)).join("; ");
  };

  const keyTimes = generateKeyTimes();

  // keySplines生成（14区間：停止7回 + 遷移7回）
  // 停止区間は線形（動かないので何でもOK）、遷移区間はイージング
  const generateKeySplines = () => {
    const linearSpline = "0 0 1 1"; // 停止区間用（実際には動かない）
    const easeSpline = "0.4 0 0.2 1"; // 遷移区間用
    const splines: string[] = [];

    for (let i = 0; i < shapes.length - 1; i++) {
      splines.push(linearSpline); // 停止
      splines.push(easeSpline); // 遷移
    }
    return splines.join("; ");
  };

  const keySplines = generateKeySplines();

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
            keySplines={keySplines}
            repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            values={generateValues(i, "cy")}
            keyTimes={keyTimes}
            dur={dur}
            calcMode="spline"
            keySplines={keySplines}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
  );
}
