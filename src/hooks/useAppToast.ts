// src/hooks/useAppToast.ts

"use client";

import { useCallback } from "react";
import {
  useAppToastStore,
  type AppToastOptions,
  type AppToastVariant,
  type AppToastPosition,
} from "@/stores/useAppToastStore";

/**
 * アプリ用トーストを制御するフック。
 * 画面中央または指定位置にリッチな通知を表示する。
 *
 * @example
 * const { showAppToast, hideAppToast } = useAppToast();
 *
 * // ショートハンド（message, variant, position?）
 * showAppToast("保存しました", "success");
 * showAppToast("エラーが発生しました", "error", "top-center");
 *
 * // オブジェクト形式（詳細オプション）
 * showAppToast({
 *   message: "処理中...",
 *   variant: "loading",
 *   mode: "persistent",
 * });
 *
 * // サイズ指定
 * showAppToast({
 *   message: "大きな通知",
 *   variant: "info",
 *   size: "lg",
 * });
 *
 * // アイコン回転（loading以外でも）
 * showAppToast({
 *   message: "同期中...",
 *   variant: "info",
 *   spinning: true,
 * });
 *
 * // 永続表示（手動消去）
 * showAppToast({
 *   message: "アップロード中...",
 *   variant: "loading",
 *   mode: "persistent",
 * });
 * await upload();
 * hideAppToast();
 */
export function useAppToast() {
  const show = useAppToastStore((s) => s.show);
  const hide = useAppToastStore((s) => s.hide);

  const showAppToast = useCallback(
    (
      messageOrOptions: string | AppToastOptions,
      variant?: AppToastVariant,
      position?: AppToastPosition,
    ) => {
      if (typeof messageOrOptions === "string") {
        show({
          message: messageOrOptions,
          variant: variant ?? "info",
          position,
        });
      } else {
        show(messageOrOptions);
      }
    },
    [show],
  );

  const hideAppToast = useCallback(() => {
    hide();
  }, [hide]);

  return { showAppToast, hideAppToast };
}
