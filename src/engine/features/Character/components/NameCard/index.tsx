/**
 * NameCard - キャラクター名表示
 *
 * 表示中のキャラクター名を表示する Widget
 * store から直接読み取る（props 不要）
 */

"use client"

import type { CSSProperties } from "react"
import type { Position } from "../../types"
import { useCharacter } from "../../hooks"
import { Underline } from "./Underline"

type Props = {
  style?: CSSProperties
  "data-widget"?: string
}

/**
 * Position を画面座標のパーセンテージに変換
 */
function positionToPercent(position: Position): { x: number; y: number } {
  if (position === "left") return { x: 18, y: 92 }
  if (position === "center") return { x: 50, y: 92 }
  if (position === "right") return { x: 82, y: 92 }
  if (typeof position === "number") return { x: position * 100, y: 92 }
  return { x: 50, y: 92 }
}

export function NameCard({
  style,
  "data-widget": dataWidget,
}: Props) {
  const { characterConfigs, displayStates } = useCharacter()

  // 表示中のキャラクターを取得
  const visibleCharacters = Object.entries(displayStates).filter(
    ([, state]) => state.visible
  )

  if (visibleCharacters.length === 0) {
    return null
  }

  return (
    <>
      {visibleCharacters.map(([id, state]) => {
        const config = characterConfigs[id]
        if (!config) return null

        const { x, y } = positionToPercent(state.position)

        return (
          <div
            key={id}
            className="-translate-x-1/2 pointer-events-auto"
            style={{
              ...style,
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
            }}
            data-widget={dataWidget}
          >
            <Underline name={config.name} color={config.color} />
          </div>
        )
      })}
    </>
  )
}
