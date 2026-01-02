"use client";

import {
  SHAPE_SQUARE,
  SHAPE_SEQUENCE,
  DOT_COUNT,
  type ShapeCoordinates,
} from "./dotShapes";

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
  const dotSize = 10;
  const dotOpacity = 0.65;

  const shapes = SHAPE_SEQUENCE;
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
      .flatMap((shape: ShapeCoordinates, i: number) =>
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
      {Array.from({ length: DOT_COUNT }, (_, i) => (
        <circle
          key={i}
          cx={SHAPE_SQUARE[i][0]}
          cy={SHAPE_SQUARE[i][1]}
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
