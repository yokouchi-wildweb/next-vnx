/**
 * Lab 003: SceneController 動作確認
 *
 * 目的: SceneController + SceneComposer で画面描画を確認
 */
"use client"

import { useEffect, useState } from "react"
import { GameScreen } from "@/engine/components/Screen"
import { SceneController } from "@/engine/core/SceneController/SceneController"
import { createScenarioResolver } from "@/engine/utils/assetResolver"
import type { Scene } from "@/engine/types"

const SCENARIO_ID = "_sample"
const SCENE_ID = "church"

type ScenarioCharacter = {
  name: string
  color: string
  sprites: Record<string, string>
}

type SceneCharacterPosition = {
  position: string
}

type MergedCharacter = ScenarioCharacter &
  SceneCharacterPosition & {
    /** 解決済みのフルパス */
    spritePath: string
  }

export default function SceneControllerLabPage() {
  const [scene, setScene] = useState<Scene | null>(null)
  const [error, setError] = useState<string | null>(null)

  // シナリオ + シーンデータを読み込んでマージ
  useEffect(() => {
    const loadData = async () => {
      try {
        const resolver = createScenarioResolver(SCENARIO_ID)

        // 並列で読み込み
        const [scenarioData, sceneData] = await Promise.all([
          resolver.loadScenario(),
          resolver.loadScene(SCENE_ID),
        ])

        // キャラクター情報をマージ + スプライトパス解決
        const mergedCharacters: Record<string, MergedCharacter> = {}
        const scenarioChars = scenarioData.characters as Record<
          string,
          ScenarioCharacter
        >
        const sceneChars = sceneData.characters as Record<
          string,
          SceneCharacterPosition
        >

        for (const [id, sceneChar] of Object.entries(sceneChars)) {
          const scenarioChar = scenarioChars[id]
          if (scenarioChar) {
            // スプライトパスをフルパスに変換
            const spritePath = resolver.character(scenarioChar.sprites.default)
            mergedCharacters[id] = {
              ...scenarioChar,
              ...sceneChar,
              spritePath,
            }
          }
        }

        // 背景パスもフルパスに変換
        const backgrounds = sceneData.backgrounds as Record<string, string>
        const resolvedBackgrounds: Record<string, string> = {}
        for (const [key, path] of Object.entries(backgrounds)) {
          resolvedBackgrounds[key] = resolver.background(path)
        }

        // マージした scene データ
        const mergedScene: Scene = {
          ...(sceneData as Scene),
          characters: mergedCharacters,
          backgrounds: resolvedBackgrounds,
        }

        setScene(mergedScene)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      }
    }

    loadData()
  }, [])

  // エラー表示
  if (error) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    )
  }

  // ローディング
  if (!scene) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  return (
    <GameScreen>
      <SceneController scene={scene} />
    </GameScreen>
  )
}
