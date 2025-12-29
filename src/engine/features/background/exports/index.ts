/**
 * Background Feature Bundle
 */

import { backgroundCommands } from "../commands"
import { useBackground, useBackgroundActions } from "../hooks"
import { BackgroundSprite } from "./BackgroundSprite"

export const background = {
  name: "background",
  commands: backgroundCommands,
  Sprites: {
    Background: BackgroundSprite,
  },
  Layers: {},
  Widgets: {},
  hooks: {
    useBackground,
    useBackgroundActions,
  },
}

// 生コンポーネントのエクスポート（再利用向け）
export { Background } from "../sprites/Background"
