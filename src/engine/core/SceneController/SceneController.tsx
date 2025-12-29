/**
 * SceneController
 *
 * シーンの初期化と制御を担当
 * - scene.type から SceneTypeDefinition を取得
 * - 各 Feature の commands.init を呼び出し
 * - SceneComposer に arrangement と featureMap を渡して UI を配置
 */
"use client"

import { useEffect, useMemo, useRef } from "react"
import type { Scene, SceneTypeDefinition, FeatureBundle } from "@/engine/types"
import { getSceneDefinition } from "@/engine/core/registries"
import { SceneComposer } from "@/engine/core/SceneComposer/SceneComposer"

type Props = {
  /** シーンデータ */
  scene: Scene
}

/**
 * SceneController コンポーネント
 */
export function SceneController({ scene }: Props) {
  const initializedRef = useRef(false)

  // SceneTypeDefinition を取得
  const definition = useMemo<SceneTypeDefinition>(() => {
    return getSceneDefinition(scene.type)
  }, [scene.type])

  // Feature Map を構築（features は FeatureBundle[] なので直接使用）
  const featureMap = useMemo<Map<string, FeatureBundle>>(() => {
    const map = new Map<string, FeatureBundle>()
    for (const feature of definition.features) {
      map.set(feature.name, feature)
    }
    return map
  }, [definition.features])

  // 各 Feature を初期化
  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    // scene 全体を渡す。Feature 側で必要なデータを取り出す
    for (const feature of featureMap.values()) {
      feature.commands.init?.(scene)
    }

    // クリーンアップ: 各 Feature をリセット
    return () => {
      for (const feature of featureMap.values()) {
        feature.commands.reset?.({})
      }
      initializedRef.current = false
    }
  }, [scene, featureMap])

  return (
    <SceneComposer
      arrangement={definition.arrangement}
      featureMap={featureMap}
    />
  )
}
