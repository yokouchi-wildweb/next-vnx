/**
 * DialogueCharactersSprite
 *
 * createSprite でラップされた対話キャラクタースプライト
 */

import { createSprite } from "@/engine/components/factories"
import { DialogueCharacters } from "../sprites/DialogueCharacters"

export const DialogueCharactersSprite = createSprite(DialogueCharacters, {
  name: "DialogueCharacters",
})
