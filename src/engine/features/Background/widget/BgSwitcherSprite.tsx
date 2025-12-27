/**
 * BgSwitcherSprite
 *
 * createSprite でラップされた背景切り替えスプライト
 * Scene から安全に使用可能
 */

import { createSprite } from "@/engine/components/createSprite"
import { Switcher } from "../sprites/Switcher"

export const BgSwitcherSprite = createSprite(Switcher, {
  name: "BgSwitcher",
})
