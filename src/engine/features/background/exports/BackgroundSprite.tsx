/**
 * BackgroundSprite
 *
 * createSprite でラップされた背景スプライト
 */

import { createSprite } from "@/engine/components/factories"
import { Background } from "../sprites/Background"

export const BackgroundSprite = createSprite(Background, {
  name: "Background",
})
