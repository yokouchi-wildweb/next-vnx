/**
 * SceneController
 *
 * シーンの初期化と制御を担当
 * - scene.type から SceneTypeDefinition を取得
 * - 各 Feature の commands.init を呼び出し
 * - SceneComposer に arrangement を渡す
 */
"use client"

import { useEffect, useMemo, useRef, type ReactNode } from "react"
import type { Scene, SceneTypeDefinition, FeatureBundle } from "@/engine/types"
import { getSceneDefinition, getFeature } from "@/engine/core/registries"

type Props = {
  /** シーンデータ */
  scene: Scene
  children?: ReactNode
}

/**
 * SceneController コンポーネント
 */
export function SceneController({ scene, children }: Props) {
  const initializedRef = useRef(false)

  // SceneTypeDefinition を取得
  const definition = useMemo<SceneTypeDefinition>(() => {
    return getSceneDefinition(scene.type)
  }, [scene.type])

  // Feature Map を構築
  const featureMap = useMemo<Map<string, FeatureBundle>>(() => {
    const map = new Map<string, FeatureBundle>()
    for (const featureName of definition.features) {
      const feature = getFeature(featureName)
      if (feature) {
        map.set(featureName, feature)
      }
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

  return <>{children}</>
}
