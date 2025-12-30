/**
 * Lab 004: トンネル背景
 *
 * 目的: 中心から放射状に広がる多角形グリッドで奥行き感のある背景を生成
 *
 * 検証項目:
 * - SVG動的生成によるパフォーマンス
 * - 四角形/六角形の切り替え
 * - パラメータ調整による見た目のカスタマイズ
 * - レスポンシブ対応
 *
 * 参考: vket.com の背景パターン
 */
"use client"

import { useState, useMemo } from "react"
import { generateTunnelSVG, type TunnelSVGOptions } from "./generateTunnelSVG"

export default function TunnelBackgroundPage() {
  // パラメータ状態
  const [sides, setSides] = useState<number>(4)
  const [layers, setLayers] = useState(20)
  const [strokeWidth, setStrokeWidth] = useState(1)
  const [strokeOpacity, setStrokeOpacity] = useState(0.25)
  const [gradientStart, setGradientStart] = useState("#5dbdff")
  const [gradientEnd, setGradientEnd] = useState("#dc72ff")
  const [minScale, setMinScale] = useState(0.08)
  const [maxScale, setMaxScale] = useState(1.5)
  const [drawRadialLines, setDrawRadialLines] = useState(true)
  const [perspectivePower, setPerspectivePower] = useState(2)
  const [showControls, setShowControls] = useState(true)

  // SVGオプション
  const svgOptions: TunnelSVGOptions = useMemo(
    () => ({
      sides,
      layers,
      strokeWidth,
      strokeOpacity,
      gradientStart,
      gradientEnd,
      minScale,
      maxScale,
      drawRadialLines,
      perspectivePower,
    }),
    [sides, layers, strokeWidth, strokeOpacity, gradientStart, gradientEnd, minScale, maxScale, drawRadialLines, perspectivePower]
  )

  // SVG生成
  const svgContent = useMemo(() => generateTunnelSVG(svgOptions), [svgOptions])

  // SVGのサイズ（文字数）
  const svgSize = svgContent.length

  return (
    <div className="relative min-h-screen">
      {/* 背景SVG */}
      <div
        className="fixed inset-0 -z-10"
        dangerouslySetInnerHTML={{ __html: svgContent }}
        style={{
          // SVGを背景全体に広げる
        }}
      />

      {/* SVGスタイル調整 */}
      <style jsx global>{`
        .fixed svg {
          width: 100%;
          height: 100%;
        }
      `}</style>

      {/* コントロールパネルトグル */}
      <button
        onClick={() => setShowControls(!showControls)}
        className="fixed top-4 right-4 z-50 px-4 py-2 bg-black/50 hover:bg-black/70 text-white rounded-lg backdrop-blur-sm transition"
      >
        {showControls ? "パネルを隠す" : "パネルを表示"}
      </button>

      {/* コントロールパネル */}
      {showControls && (
        <div className="fixed top-4 left-4 z-50 w-80 p-4 bg-black/70 backdrop-blur-sm rounded-lg text-white">
          <h2 className="text-lg font-bold mb-4">トンネル背景パラメータ</h2>

          {/* 多角形タイプ */}
          <div className="mb-4">
            <label className="block text-sm mb-2">形状（辺の数: {sides}）</label>
            <div className="grid grid-cols-4 gap-1 mb-2">
              {[
                { n: 3, label: "△" },
                { n: 4, label: "□" },
                { n: 5, label: "⬠" },
                { n: 6, label: "⬡" },
                { n: 8, label: "⯃" },
                { n: 10, label: "10" },
                { n: 12, label: "12" },
                { n: 16, label: "16" },
              ].map(({ n, label }) => (
                <button
                  key={n}
                  onClick={() => setSides(n)}
                  className={`px-2 py-2 rounded text-sm ${
                    sides === n ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <input
              type="range"
              min="3"
              max="24"
              value={sides}
              onChange={(e) => setSides(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* レイヤー数 */}
          <div className="mb-4">
            <label className="block text-sm mb-1">
              レイヤー数: {layers}
            </label>
            <input
              type="range"
              min="5"
              max="50"
              value={layers}
              onChange={(e) => setLayers(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* 遠近感の強さ */}
          <div className="mb-4">
            <label className="block text-sm mb-1">
              遠近感: {perspectivePower.toFixed(1)}
              <span className="text-xs text-gray-400 ml-2">
                {perspectivePower <= 1 ? "(線形)" : perspectivePower <= 2 ? "(軽い)" : perspectivePower <= 3 ? "(中程度)" : "(強い)"}
              </span>
            </label>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.1"
              value={perspectivePower}
              onChange={(e) => setPerspectivePower(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>均等</span>
              <span>中心密集</span>
            </div>
          </div>

          {/* 線の太さ */}
          <div className="mb-4">
            <label className="block text-sm mb-1">
              線の太さ: {strokeWidth}px
            </label>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.5"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* 線の不透明度 */}
          <div className="mb-4">
            <label className="block text-sm mb-1">
              線の不透明度: {(strokeOpacity * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0.05"
              max="1"
              step="0.05"
              value={strokeOpacity}
              onChange={(e) => setStrokeOpacity(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* グラデーション */}
          <div className="mb-4">
            <label className="block text-sm mb-2">グラデーション</label>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">開始色</label>
                <input
                  type="color"
                  value={gradientStart}
                  onChange={(e) => setGradientStart(e.target.value)}
                  className="w-full h-8 rounded cursor-pointer"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">終了色</label>
                <input
                  type="color"
                  value={gradientEnd}
                  onChange={(e) => setGradientEnd(e.target.value)}
                  className="w-full h-8 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* 中心サイズ */}
          <div className="mb-4">
            <label className="block text-sm mb-1">
              中心サイズ: {(minScale * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0.02"
              max="0.3"
              step="0.01"
              value={minScale}
              onChange={(e) => setMinScale(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* 最大サイズ */}
          <div className="mb-4">
            <label className="block text-sm mb-1">
              最大サイズ: {(maxScale * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0.8"
              max="2.5"
              step="0.1"
              value={maxScale}
              onChange={(e) => setMaxScale(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* 放射線 */}
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={drawRadialLines}
                onChange={(e) => setDrawRadialLines(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">放射線を表示</span>
            </label>
          </div>

          {/* SVGサイズ表示 */}
          <div className="pt-4 border-t border-gray-600">
            <p className="text-xs text-gray-400">
              SVGサイズ: {(svgSize / 1024).toFixed(2)} KB
            </p>
            <p className="text-xs text-gray-400">
              元のvket.com: ~150 KB
            </p>
          </div>

          {/* プリセット */}
          <div className="mt-4 pt-4 border-t border-gray-600">
            <label className="block text-sm mb-2">プリセット</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setSides(4)
                  setLayers(20)
                  setStrokeOpacity(0.25)
                  setGradientStart("#5dbdff")
                  setGradientEnd("#dc72ff")
                  setPerspectivePower(2)
                }}
                className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
              >
                vket風
              </button>
              <button
                onClick={() => {
                  setSides(6)
                  setLayers(15)
                  setStrokeOpacity(0.3)
                  setGradientStart("#00ff88")
                  setGradientEnd("#0088ff")
                  setPerspectivePower(2.5)
                }}
                className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
              >
                サイバー六角
              </button>
              <button
                onClick={() => {
                  setSides(8)
                  setLayers(18)
                  setStrokeOpacity(0.35)
                  setGradientStart("#667eea")
                  setGradientEnd("#764ba2")
                  setPerspectivePower(2)
                }}
                className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
              >
                八角パープル
              </button>
              <button
                onClick={() => {
                  setSides(4)
                  setLayers(35)
                  setStrokeOpacity(0.2)
                  setGradientStart("#1a1a2e")
                  setGradientEnd("#16213e")
                  setPerspectivePower(4)
                }}
                className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
              >
                深淵
              </button>
              <button
                onClick={() => {
                  setSides(6)
                  setLayers(25)
                  setStrokeOpacity(0.4)
                  setGradientStart("#ff6b6b")
                  setGradientEnd("#feca57")
                  setPerspectivePower(1.5)
                }}
                className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
              >
                サンセット
              </button>
              <button
                onClick={() => {
                  setSides(4)
                  setLayers(40)
                  setStrokeOpacity(0.15)
                  setGradientStart("#0a0a0a")
                  setGradientEnd("#1a1a2e")
                  setPerspectivePower(5)
                }}
                className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
              >
                ワープ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 中央コンテンツサンプル */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
            トンネル背景
          </h1>
          <p className="text-xl text-white/80 drop-shadow">
            {sides}角形 × {layers}レイヤー
          </p>
        </div>
      </div>
    </div>
  )
}
