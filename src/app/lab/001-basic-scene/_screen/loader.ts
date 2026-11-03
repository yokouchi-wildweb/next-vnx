// src/app/lab/001-basic-scene/_screen/loader.ts
// /lab/001-basic-scene の loader。lab の範囲(src/app/lab/guard.ts: 管理者カテゴリ + debugger、それ以外は 404)の createLoader で access だけを評価する。
// サーバー側の取得は無い(画面本体はクライアントの実験用モック)。

import "server-only";

import { createLoader } from "../../guard";

export const loadBasicSceneScreen = createLoader({
  access: { roles: ["debugger"], roleCategories: ["admin"] }, // = ADMIN_OR_DEBUGGER_RULE(ルート地図が字面で読むため値で書く)
  load: async (): Promise<void> => {},
});
