/**
 * Dialogue Store（公開インターフェース）
 */
"use client"

import { internalStore } from "./internalStore"

/** Dialogue Store を使用する */
export const useDialogueStore = () => internalStore()
