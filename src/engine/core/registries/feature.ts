/**
 * Feature Registry
 *
 * Feature Bundle の登録・取得
 * 中央集権的に全 Feature を管理
 */

import type { FeatureBundle } from "@/engine/types"
import { Background } from "@/engine/features/Background/exports"
import { Character } from "@/engine/features/Character/exports"
import { Dialogue } from "@/engine/features/Dialogue/exports"

/** Feature レジストリ */
export const featureRegistry: Record<string, FeatureBundle> = {
  Background,
  Character,
  Dialogue,
}

/**
 * Feature を取得
 */
export function getFeature(name: string): FeatureBundle | undefined {
  return featureRegistry[name]
}

/**
 * 登録済みの Feature 名一覧を取得
 */
export function getRegisteredFeatures(): string[] {
  return Object.keys(featureRegistry)
}
