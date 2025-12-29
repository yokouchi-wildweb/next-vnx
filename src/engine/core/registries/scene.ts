/**
 * Scene Registry
 *
 * シーンタイプの登録・取得
 * 中央集権的に全シーンタイプを管理
 */

import type { SceneTypeDefinition } from "@/engine/types"
import { dialogueScene } from "@/engine/scene/dialogue"

/** シーン定義レジストリ */
export const sceneRegistry: Record<string, SceneTypeDefinition> = {
  dialogue: dialogueScene,
  // 将来追加
  // battle: battleScene,
  // exploration: explorationScene,
}

/**
 * シーンタイプの定義を取得
 */
export function getSceneDefinition(type: string): SceneTypeDefinition {
  const definition = sceneRegistry[type]
  if (!definition) {
    throw new Error(`Scene type not found: ${type}`)
  }
  return definition
}

/**
 * シーンタイプが登録されているか確認
 */
export function hasSceneType(type: string): boolean {
  return type in sceneRegistry
}

/**
 * 登録済みのシーンタイプ一覧を取得
 */
export function getRegisteredSceneTypes(): string[] {
  return Object.keys(sceneRegistry)
}
