/**
 * NPC一覧
 */
import { NPCConfig } from "../types"
import { npcGrandpa } from "./grandpa"

export { npcGrandpa }

// NPC IDでアクセスできるマップ
export const NPC_MAP: Record<string, NPCConfig> = {
  grandpa: npcGrandpa,
  // shop: npcShopkeeper,     // 将来追加
  // suspect: npcSuspect,     // 将来追加
}

// UI表示用のNPCリスト
export const NPC_LIST = [
  { id: "grandpa", name: "田中義男", description: "散歩中のおじいちゃん（目撃者）" },
  // { id: "shop", name: "店主", description: "近くのコンビニ店主" },
  // { id: "suspect", name: "容疑者", description: "怪しい男" },
] as const

export type NPCId = keyof typeof NPC_MAP
