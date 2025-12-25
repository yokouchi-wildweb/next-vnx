/**
 * NPC設定の型定義
 */

export interface Clue {
  id: string                  // 一意のID
  label: string               // 表示用ラベル（「黒いパーカーの男を目撃」など）
  keywords: string[]          // この情報に関連するキーワード（AIが判定に使う）
}

export interface NPCConfig {
  id: string
  name: string
  age: number
  occupation: string
  personality: string[]       // 性格特性
  speechStyle: string[]       // 口調・話し方の特徴
  goal: string                // このNPCの目的（何をしたいか）
  knowledge: string[]         // 知っている情報
  restrictions: string[]      // 答えられない・知らないこと
  clues: Clue[]               // 引き出すべき重要情報
  additionalPrompt?: string   // 自由記述の追加指示
}
