/**
 * NPC一覧
 */
import { NPCConfig } from "../types"
import { npcGrandpa } from "./grandpa"
import { npcFriend } from "./friend"
import { npcSuspicious } from "./suspicious"

export { npcGrandpa, npcFriend, npcSuspicious }

// NPC IDでアクセスできるマップ
export const NPC_MAP: Record<string, NPCConfig> = {
  grandpa: npcGrandpa,
  friend: npcFriend,
  suspicious: npcSuspicious,
}

// UI表示用のNPCリスト
export const NPC_LIST = [
  { id: "grandpa", name: "田中義男", description: "散歩中のおじいちゃん（目撃者）" },
  { id: "friend", name: "山田健太", description: "被害者の親友" },
  { id: "suspicious", name: "佐藤隆", description: "怪しい男（容疑者候補）" },
] as const

export type NPCId = keyof typeof NPC_MAP
