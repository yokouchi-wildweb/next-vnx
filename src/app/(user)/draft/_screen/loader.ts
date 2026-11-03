// src/app/(user)/draft/_screen/loader.ts
// /draft(トップページ案)の loader。root の範囲(src/app/guard.ts)の createLoader で access だけを評価する(public。公開ページ、D6)。
// サーバー側の取得は無い。

import "server-only";

import { createLoader } from "@/app/guard";

export const loadDraftScreen = createLoader({
  access: "public",
  load: async (): Promise<void> => {},
});
