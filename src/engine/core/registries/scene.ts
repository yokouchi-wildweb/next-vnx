/**
 * Scene Registry
 *
 * シーンタイプの登録・取得
 * 中央集権的に全シーンタイプを管理
 */

import type { SceneType, SceneTypeDefinition } from "@/engine/types"
import { dialogueScene } from "@/engine/scene/dialogue"

/** シーン定義レジストリ */
export const sceneRegistry: Partial<Record<SceneType, SceneTypeDefinition>> = {
  dialogue: dialogueScene,
  // 将来追加
  // battle: battleScene,
  // exploration: explorationScene,
}

/**
 * シーンタイプの定義を取得
 */
export function getSceneDefinition(type: SceneType): SceneTypeDefinition {
  const definition = sceneRegistry[type]
  if (!definition) {
    throw new Error(`Scene type not found: ${type}`)
  }
  return definition
}

/**
 * シーンタイプが登録されているか確認
 */
export function hasSceneType(type: SceneType): boolean {
  return type in sceneRegistry
}

/**
 * 登録済みのシーンタイプ一覧を取得
 */
export function getRegisteredSceneTypes(): SceneType[] {
  return Object.keys(sceneRegistry) as SceneType[]
}
