/**
 * CharacterSprite
 *
 * createSprite でラップされたキャラクタースプライト
 */

import { createSprite } from "@/engine/components/factories"
import { Standing } from "../sprites/Standing"

export const CharacterSprite = createSprite(Standing, {
  name: "Character",
})
