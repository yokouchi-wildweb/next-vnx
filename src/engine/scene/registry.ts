/**
 * Scene Registry
 *
 * シーンタイプの登録・取得
 */

import type { SceneType, SceneTypeDefinition } from "@/engine/types"

/** シーン定義レジストリ */
const sceneRegistry = new Map<SceneType, SceneTypeDefinition>()

/**
 * シーンタイプを登録
 */
export function registerScene(
  type: SceneType,
  definition: SceneTypeDefinition
): void {
  sceneRegistry.set(type, definition)
}

/**
 * シーンタイプの定義を取得
 */
export function getSceneDefinition(type: SceneType): SceneTypeDefinition {
  const definition = sceneRegistry.get(type)
  if (!definition) {
    throw new Error(`Scene type not found: ${type}`)
  }
  return definition
}

/**
 * シーンタイプが登録されているか確認
 */
export function hasSceneType(type: SceneType): boolean {
  return sceneRegistry.has(type)
}

/**
 * 登録済みのシーンタイプ一覧を取得
 */
export function getRegisteredSceneTypes(): SceneType[] {
  return Array.from(sceneRegistry.keys())
}
