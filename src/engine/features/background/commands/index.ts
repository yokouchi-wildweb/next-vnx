/**
 * Background Commands
 *
 * Background Feature のコマンドハンドラー
 */

import type { Scene } from "@/engine/types"
import { backgroundStore } from "../stores"

export const backgroundCommands = {
  /**
   * 初期化（scene 全体から必要なデータを取り出す）
   */
  init: (scene: Scene) => {
    const backgrounds = scene.backgrounds as Record<string, string> | undefined
    const initialBackground = scene.initialBackground as string | undefined
    if (backgrounds) {
      backgroundStore.getState().initialize(backgrounds, initialBackground)
    }
  },

  /**
   * 背景を変更
   */
  change: (data: { value: string }) => {
    backgroundStore.getState().setBackground(data.value)
  },

  /**
   * リセット
   */
  reset: () => {
    backgroundStore.getState().reset()
  },
}
