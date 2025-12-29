/**
 * Background Commands
 *
 * Background Feature のコマンドハンドラー
 */

import { backgroundStore } from "../stores"

export const backgroundCommands = {
  /**
   * 初期化
   * @param data.backgrounds - 背景バリエーション
   * @param data.initial - 初期背景キー
   */
  init: (data: { backgrounds?: Record<string, string>; initial?: string }) => {
    if (data.backgrounds) {
      backgroundStore.getState().initialize(data.backgrounds, data.initial)
    }
  },

  /**
   * 背景を変更
   * @param data.value - 背景キー
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
