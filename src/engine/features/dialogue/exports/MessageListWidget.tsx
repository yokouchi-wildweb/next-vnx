/**
 * MessageListWidget
 *
 * createWidget でラップされたメッセージリスト
 */

import { createWidget } from "@/engine/components/factories"
import { MessageList } from "../components/MessageList"

export const MessageListWidget = createWidget(MessageList, {
  name: "MessageList",
  zIndex: 0,
})
