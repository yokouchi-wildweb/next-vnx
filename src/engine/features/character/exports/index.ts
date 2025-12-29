/**
 * Character Feature Bundle
 */

import { characterCommands } from "../commands"
import { useCharacter, useCharacterActions } from "../hooks"
import { CharacterSprite } from "./CharacterSprite"
import { NameCardWidget } from "./NameCardWidget"

export const character = {
  name: "character",
  commands: characterCommands,
  Sprites: {
    Character: CharacterSprite,
  },
  Layers: {},
  Widgets: {
    NameCard: NameCardWidget,
  },
  hooks: {
    useCharacter,
    useCharacterActions,
  },
}
