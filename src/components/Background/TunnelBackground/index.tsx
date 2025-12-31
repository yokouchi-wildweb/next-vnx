/**
 * トンネル背景コンポーネント
 *
 * 使用例:
 * ```tsx
 * // プリセットを使用
 * <TunnelBackground preset="pentagonDeep" />
 *
 * // カスタムオプション
 * <TunnelBackground options={{ sides: 6, layers: 30 }} />
 *
 * // 固定位置の背景として
 * <TunnelBackground preset="vketStyle" fixed />
 * ```
 */
"use client"

import { useMemo } from "react"
import { generateTunnelSVG, type TunnelSVGOptions } from "./generator"
import { getPreset, type TunnelPresetName } from "./presets"

export interface TunnelBackgroundProps {
  /** プリセット名 */
  preset?: TunnelPresetName
  /** カスタムオプション（プリセットより優先、またはプリセットとマージ） */
  options?: Partial<TunnelSVGOptions>
  /** 固定位置で表示（position: fixed） */
  fixed?: boolean
  /** 追加のクラス名 */
  className?: string
  /** z-index（デフォルト: -10） */
  zIndex?: number
}

export function TunnelBackground({
  preset = "vketStyle",
  options,
  fixed = true,
  className = "",
  zIndex = -10,
}: TunnelBackgroundProps) {
  // オプションをマージ
  const mergedOptions = useMemo(() => {
    const presetOptions = getPreset(preset)
    return options ? { ...presetOptions, ...options } : presetOptions
  }, [preset, options])

  // SVG生成
  const svgContent = useMemo(
    () => generateTunnelSVG(mergedOptions),
    [mergedOptions]
  )

  return (
    <>
      <div
        className={`inset-0 ${fixed ? "fixed" : "absolute"} ${className}`}
        style={{ zIndex }}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
      <style jsx global>{`
        .fixed svg,
        .absolute svg {
          width: 100%;
          height: 100%;
        }
      `}</style>
    </>
  )
}

export default TunnelBackground
