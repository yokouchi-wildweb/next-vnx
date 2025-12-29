/**
 * Lab 003: SceneController 動作確認
 *
 * 目的: SceneController + SceneComposer で画面描画を確認
 */
"use client"

import { useEffect, useState } from "react"
import { GameScreen } from "@/engine/components/Screen"
import { SceneController } from "@/engine/core/SceneController/SceneController"
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

export default function SceneControllerLabPage() {
  const [scene, setScene] = useState<Scene | null>(null)
  const [error, setError] = useState<string | null>(null)

  // シナリオ + シーンデータを読み込んでマージ
  useEffect(() => {
    const loadData = async () => {
      try {
        // 並列で読み込み
        const [scenarioRes, sceneRes] = await Promise.all([
          fetch(`/game/scenarios/${SCENARIO_ID}/scenario.json`),
          fetch(`/game/scenarios/${SCENARIO_ID}/scenes/${SCENE_ID}/scene.json`),
        ])

        if (!scenarioRes.ok) {
          throw new Error(`Failed to load scenario: ${scenarioRes.status}`)
        }
        if (!sceneRes.ok) {
          throw new Error(`Failed to load scene: ${sceneRes.status}`)
        }

        const scenarioData = await scenarioRes.json()
        const sceneData = await sceneRes.json()

        // キャラクター情報をマージ
        const mergedCharacters: Record<string, ScenarioCharacter & SceneCharacterPosition> = {}
        const scenarioChars = scenarioData.characters as Record<string, ScenarioCharacter>
        const sceneChars = sceneData.characters as Record<string, SceneCharacterPosition>

        for (const [id, sceneChar] of Object.entries(sceneChars)) {
          const scenarioChar = scenarioChars[id]
          if (scenarioChar) {
            mergedCharacters[id] = {
              ...scenarioChar,
              ...sceneChar,
            }
          }
        }

        // マージした scene データ
        const mergedScene: Scene = {
          ...sceneData,
          characters: mergedCharacters,
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
