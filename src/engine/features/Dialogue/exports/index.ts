/**
 * Dialogue Feature Bundle
 */

import { MessageListWidget } from "./MessageListWidget"
import { useDialogue, useDialogueActions } from "../hooks"

export const Dialogue = {
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
