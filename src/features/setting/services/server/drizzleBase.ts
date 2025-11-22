// src/features/setting/services/server/drizzleBase.ts

import { settingTable } from "@/features/setting/entities/drizzle";
import {
  SettingCreateSchema,
  SettingUpsertSchema,
  SettingUpdateSchema,
} from "@/features/setting/entities/schema";
import { createCrudService } from "@/lib/crud/drizzle";

// NOTE: drizzleBase ではスキーマの parse/validation のみに責務を限定すること。
// ドメイン固有のロジック（外部サービス連携や判定処理など）は
// src/features/setting/services/server/wrappers/ 以下にラップを作成して差し替えること。

export const base = createCrudService(settingTable, {
  idType: "manual",
  parseCreate: (data) => SettingCreateSchema.parse(data),
  parseUpdate: (data) => SettingUpdateSchema.parse(data),
  parseUpsert: (data) => SettingUpsertSchema.parse(data),
});
