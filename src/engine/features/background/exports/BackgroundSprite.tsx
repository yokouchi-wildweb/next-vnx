/**
 * BackgroundSprite
 *
 * createSprite でラップされた背景スプライト
 */

import { createSprite } from "@/engine/components/factories"
import { Switcher } from "../sprites/Switcher"

export const BackgroundSprite = createSprite(Switcher, {
  name: "Background",
})
