// src/app/lab/guard.ts
//
// lab(実験場)の範囲。root に重ねて 管理者カテゴリ + debugger ロールだけ。
// 未認証・権限不足とも行き先を置かない = 404(実験場の存在を見せない。D6)。

import "server-only";

import { extend as extendRoot } from "@/app/guard";

export const { guard, createLoader, extend } = extendRoot({
  access: { roles: ["debugger"], roleCategories: ["admin"] }, // = ADMIN_OR_DEBUGGER_RULE(ルート地図が字面で読むため値で書く)
});
