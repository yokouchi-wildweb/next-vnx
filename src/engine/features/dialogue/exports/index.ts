/**
 * Dialogue Feature 公開エクスポート
 */

import { commands as dialogueCommands } from "../commands"
import { useDialogue, useDialogueActions } from "../hooks"
import { DialogueCharactersSprite } from "./DialogueCharactersSprite"
import { MessageListWidget } from "./MessageListWidget"

// Feature Bundle
export const dialogue = {
  name: "dialogue",
  commands: dialogueCommands,
  Sprites: {
    DialogueCharacters: DialogueCharactersSprite,
  },
  Layers: {},
  Widgets: {
    MessageList: MessageListWidget,
  },
  hooks: {
    useDialogue,
    useDialogueActions,
  },
}

// 生コンポーネント（再利用向け）
export { DialogueCharacters } from "../sprites/DialogueCharacters"
export { MessageList } from "../components/MessageList"
export { MessageBubble } from "../components/MessageBubble"

// Factory 適用済み（arrangement 向け）
export { DialogueCharactersSprite } from "./DialogueCharactersSprite"
export { MessageListWidget } from "./MessageListWidget"

// Hooks
export { useDialogue, useDialogueActions } from "../hooks"

// Commands
export { commands } from "../commands"

// Types
export type {
  DialogueMessage,
  MessageSide,
  DialogueState,
  CharacterSlot,
  MessageListLayout,
} from "../types"

// Defaults
export {
  defaultLeftCharacterX,
  defaultRightCharacterX,
  defaultCharacterY,
  defaultCharacterWidthPercent,
  defaultCharacterAnchorX,
  defaultCharacterAnchorY,
  defaultActiveAlpha,
  defaultInactiveAlpha,
  defaultMessageListLayout,
} from "../defaults"
