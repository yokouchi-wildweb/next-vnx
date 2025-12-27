/**
 * CharacterSprite
 *
 * createSprite でラップされた立ち絵スプライト
 * Scene から安全に使用可能
 */

import { createSprite } from "@/engine/components/factories"
import { Standing } from "../sprites/Standing"

export const CharacterSprite = createSprite(Standing, {
  name: "Character",
})
