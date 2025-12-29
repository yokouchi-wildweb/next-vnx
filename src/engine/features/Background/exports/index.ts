/**
 * Background Feature Bundle
 */

import { backgroundCommands } from "../commands"
import { useBackground, useBackgroundActions } from "../hooks"
import { BackgroundSprite } from "./BackgroundSprite"

export const Background = {
  name: "Background",
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
