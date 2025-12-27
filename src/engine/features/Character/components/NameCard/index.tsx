/**
 * NameCard - キャラクター名表示
 *
 * variant に応じて異なるスタイルで名前を表示
 *
 * 契約: createWidget から style が注入される
 */

"use client"

import type { CSSProperties } from "react"
import type { NameCardProps } from "../../types"
import { Underline } from "./Underline"

type Props = NameCardProps & {
  style?: CSSProperties
  "data-widget"?: string
}

export function NameCard({
  name,
  color,
  position,
  variant = "underline",
  style,
  "data-widget": dataWidget,
}: Props) {
  // none の場合は何も表示しない
  if (variant === "none") {
    return null
  }

  // 相対座標をパーセンテージに変換
  const left = `${position.x * 100}%`
  const top = `${position.y * 100}%`

  return (
    <div
      className="-translate-x-1/2 pointer-events-auto"
      style={{ ...style, left, top }}
      data-widget={dataWidget}
    >
      {variant === "underline" && (
        <Underline name={name} color={color} />
      )}
      {/* 将来のバリアント追加時はここに分岐を追加 */}
    </div>
  )
}
