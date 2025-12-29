/**
 * Character Feature 公開エクスポート
 */

import { CharacterSprite } from "./CharacterSprite"

// Feature Bundle
export const character = {
  name: "character",
  commands: {},
  Sprites: {
    Character: CharacterSprite,
  },
  Layers: {},
  Widgets: {},
  hooks: {},
}

// 生コンポーネント（再利用向け）
export { Standing } from "../sprites/Standing"

// Factory 適用済み（arrangement 向け）
export { CharacterSprite } from "./CharacterSprite"

// Types
export type { StandingProps } from "../types"

// Defaults
export {
  defaultAnchorX,
  defaultAnchorY,
  defaultRotation,
  defaultPivotX,
  defaultPivotY,
  defaultSkewX,
  defaultSkewY,
  defaultAlpha,
} from "../defaults"
