/**
 * Dialogue Feature Bundle
 */

import { dialogueCommands } from "../commands"
import { useDialogue, useDialogueActions } from "../hooks"
import { MessageListWidget } from "./MessageListWidget"

export const dialogue = {
  name: "dialogue",
  commands: dialogueCommands,
  Sprites: {},
  Layers: {},
  Widgets: {
    MessageList: MessageListWidget,
  },
  hooks: {
    useDialogue,
    useDialogueActions,
  },
}
