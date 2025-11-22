// src/features/user/services/server/drizzleBase.ts

import { UserTable } from "@/features/user/entities/drizzle";
import { createCrudService } from "@/lib/crud/drizzle";

// NOTE: drizzleBase ではスキーマの parse/validation のみに責務を限定すること。
// ドメイン固有のロジック（外部サービス連携や判定処理など）は
// src/features/user/services/server/wrappers/ 以下にラップを作成して差し替えること。

export const base = createCrudService(UserTable, {
  idType: "uuid",
  defaultOrderBy: [["updatedAt", "DESC"]],
  defaultSearchFields: ["displayName", "email"],
});
