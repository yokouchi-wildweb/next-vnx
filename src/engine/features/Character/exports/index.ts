/**
 * Character Feature Bundle
 */

import { characterCommands } from "../commands"
import { useCharacter, useCharacterActions } from "../hooks"
import { CharacterSprite } from "./CharacterSprite"
import { NameCardWidget } from "./NameCardWidget"

export const Character = {
  name: "Character",
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
