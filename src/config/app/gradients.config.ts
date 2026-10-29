// src/config/app/gradients.config.ts
// downstream（フォーク先）固有のグラデーショントークンを宣言する拡張ポイント。
//
// これにより upstream の src/styles/_base/gradient.css や tokens.base.ts を直接編集せずに
// プロジェクト固有のグラデーションを追加できる（マージ衝突回避・所有権の明確化）。
//
// 使い方:
//   1. 下の配列にトークンを追加する。
//   2. `pnpm gradient:gen` で src/styles/_base/gradient.css を再生成し、生成物をコミットする。
//   3. TS 側（listGradients() / getGradient() / <ColorValueInput>）には即座に反映される。
//
// 例:
//   export const customGradients: GradientTokenInput[] = [
//     { key: "tier-s", label: "Sランク", group: "ランク",
//       stops: ["oklch(0.85 0.18 95)", "oklch(0.7 0.2 40)"], text: true },
//   ];

import type { GradientTokenInput } from "@/lib/gradient/types";

/** プロジェクト固有グラデーション（next-vnx 固有。TypingText 等のテキストグラデーション用）。 */
export const customGradients: GradientTokenInput[] = [
  {
    // neon: マゼンタ → パープル → シアン
    key: "neon",
    label: "ネオン",
    group: "テキスト演出",
    text: true,
    stops: ["oklch(0.70 0.25 330)", "oklch(0.65 0.20 280)", "oklch(0.75 0.18 195)"],
  },
  {
    // mono: グレースケール
    key: "mono",
    label: "モノ",
    group: "テキスト演出",
    text: true,
    stops: ["oklch(0.45 0 0)", "oklch(0.55 0 0)", "oklch(0.65 0 0)"],
  },
];
