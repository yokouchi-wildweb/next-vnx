/**
 * MessageListWidget
 *
 * createWidget でラップされたメッセージ一覧
 */

import { createWidget } from "@/engine/components/factories"
import { MessageList } from "../components/MessageList"

export const MessageListWidget = createWidget(MessageList, {
  name: "DialogueMessageList",
  zIndex: 20,
  defaultStyle: {
    top: 0,
    bottom: "35%",
    left: "20%",
    right: "20%",
  },
})
