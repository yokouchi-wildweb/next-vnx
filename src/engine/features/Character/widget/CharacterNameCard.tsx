/**
 * CharacterNameCard
 *
 * createWidget でラップされた名前表示
 * Scene から安全に使用可能
 */

import { createWidget } from "@/engine/components/factories"
import { NameCard } from "../components/NameCard"

export const CharacterNameCard = createWidget(NameCard, {
  name: "CharacterNameCard",
  zIndex: 30,
})
