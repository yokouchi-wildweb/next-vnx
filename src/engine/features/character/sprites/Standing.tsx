/**
 * Standing - 立ち絵スプライト
 *
 * store から表示中のキャラクター情報を取得して表示する PixiJS コンポーネント
 * - シンプルな立ち絵表示
 * - 位置、スケール、透明度
 */

"use client"

import { useState, useEffect } from "react"
import { extend } from "@pixi/react"
import { Sprite, Assets, Texture } from "pixi.js"
import { useGameSize } from "@/engine/components/Screen"
import { useCharacter } from "../hooks"
import { defaultStandingAnchor } from "../defaults"
import type { Position, Position2D, Anchor2D } from "../types"

// PixiJS コンポーネントを登録
extend({ Sprite })

type Props = {
  zIndex?: number
}

/**
 * Position を Position2D に変換
 */
function positionToPosition2D(position: Position): Position2D {
  if (position === "left") return { x: 0.18, y: 1 }
  if (position === "center") return { x: 0.5, y: 1 }
  if (position === "right") return { x: 0.82, y: 1 }
  if (typeof position === "number") return { x: position, y: 1 }
  return { x: 0.5, y: 1 }
}

/**
 * 単一キャラクターのスプライト
 */
function CharacterSprite({
  characterId,
  spritePath,
  position,
  scale = 1,
  anchor = defaultStandingAnchor,
  opacity = 1,
  baseZIndex = 0,
  index,
}: {
  characterId: string
  spritePath: string
  position: Position2D
  scale?: number
  anchor?: Anchor2D
  opacity?: number
  baseZIndex?: number
  index: number
}) {
  const { width: screenWidth, height: screenHeight } = useGameSize()
  const [texture, setTexture] = useState<Texture | null>(null)

  // スプライト画像をロード
  useEffect(() => {
    let mounted = true
    const loadTexture = async () => {
      try {
        // TODO: シナリオIDをContextから取得する
        const tex = await Assets.load(`/game/scenarios/_sample/characters/${spritePath}.png`)
        if (mounted) {
          setTexture(tex)
        }
      } catch (err) {
        console.warn(`Failed to load character sprite: ${spritePath}`, err)
      }
    }

    loadTexture()
    return () => {
      mounted = false
    }
  }, [spritePath])

  if (!texture) {
    return null
  }

  // 相対座標をピクセルに変換
  const x = position.x * screenWidth
  const y = position.y * screenHeight

  return (
    <pixiSprite
      texture={texture}
      x={x}
      y={y}
      scale={scale}
      anchor={anchor}
      alpha={opacity}
      zIndex={baseZIndex + index}
    />
  )
}

export function Standing({ zIndex = 0 }: Props) {
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
      {visibleCharacters.map(([id, state], index) => {
        const config = characterConfigs[id]
        if (!config) return null

        // スプライトパスを取得（state.sprite または config.sprites.default）
        const spritePath = state.sprite
          ? config.sprites?.[state.sprite]
          : config.sprites?.default

        if (!spritePath) {
          console.warn(`No sprite path for character: ${id}`)
          return null
        }

        const position2D = positionToPosition2D(state.position)

        return (
          <CharacterSprite
            key={id}
            characterId={id}
            spritePath={spritePath}
            position={position2D}
            scale={state.scale ?? config.scale}
            baseZIndex={zIndex}
            index={index}
          />
        )
      })}
    </>
  )
}
