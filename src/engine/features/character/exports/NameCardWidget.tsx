/**
 * NameCardWidget
 *
 * createWidget でラップされた名前表示
 */

import { createWidget } from "@/engine/components/factories"
import { NameCard } from "../components/NameCard"

export const NameCardWidget = createWidget(NameCard, {
  name: "CharacterNameCard",
  zIndex: 30,
})
