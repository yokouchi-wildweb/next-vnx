/**
 * DialogueCharacters - 対話シーンのキャラクター表示
 *
 * character Feature の Standing を利用して左右にキャラクターを配置
 * - Store から状態を取得
 * - アクティブ状態に応じて透明度を変更
 */
"use client"

import { Standing } from "@/engine/features/character/exports"
import { useDialogue } from "../hooks"
import { defaultActiveAlpha, defaultInactiveAlpha } from "../defaults"

type Props = {
  zIndex?: number
}

export function DialogueCharacters({ zIndex = 0 }: Props) {
  const { leftCharacter, rightCharacter } = useDialogue()

  return (
    <>
      {leftCharacter && (
        <Standing
          spritePath={leftCharacter.spritePath}
          x={leftCharacter.x}
          y={leftCharacter.y}
          widthPercent={leftCharacter.widthPercent}
          anchorX={leftCharacter.anchorX}
          anchorY={leftCharacter.anchorY}
          alpha={leftCharacter.isActive ? defaultActiveAlpha : defaultInactiveAlpha}
          zIndex={zIndex}
        />
      )}
      {rightCharacter && (
        <Standing
          spritePath={rightCharacter.spritePath}
          x={rightCharacter.x}
          y={rightCharacter.y}
          widthPercent={rightCharacter.widthPercent}
          anchorX={rightCharacter.anchorX}
          anchorY={rightCharacter.anchorY}
          alpha={rightCharacter.isActive ? defaultActiveAlpha : defaultInactiveAlpha}
          zIndex={zIndex + 1}
        />
      )}
    </>
  )
}
