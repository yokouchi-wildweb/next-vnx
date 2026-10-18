// src/features/save/services/server/drizzleBase.ts

import { getDomainConfig, type DomainConfig } from "@/lib/domain";
import { SaveTable } from "@/features/save/entities/drizzle";
import { UserTable } from "@/features/user/entities/drizzle";
import { SaveCreateSchema, SaveUpdateSchema } from "@/features/save/entities/schema";
import { extractStorageFields } from "@/lib/crud/storageIntegration/extractStorageFields";
import { createCrudService } from "@/lib/crud/drizzle";
import type { DrizzleCrudServiceOptions } from "@/lib/crud/drizzle/types";
import type { IdType, OrderBySpec } from "@/lib/crud/types";
import type { AnyPgColumn } from "drizzle-orm/pg-core";
import type { z } from "zod";

const conf = getDomainConfig("save");

// sortOrderField が設定されている場合、対応するカラムを取得
const sortOrderColumn = conf.sortOrderField
  ? ((SaveTable as unknown as Record<string, unknown>)[conf.sortOrderField] as AnyPgColumn)
  : undefined;

export const baseOptions = {
  idType: conf.idType as IdType,
  useCreatedAt: conf.useCreatedAt,
  useUpdatedAt: conf.useUpdatedAt,
  useSoftDelete: conf.useSoftDelete,
  defaultSearchFields: conf.searchFields,
  defaultOrderBy: conf.defaultOrderBy as OrderBySpec,
  belongsToRelations: [
    {
      field: "user",
      foreignKey: "user_id",
      table: UserTable,
    }
  ],

} satisfies DrizzleCrudServiceOptions<
  z.infer<typeof SaveCreateSchema>
>;

// 互換性のためエイリアスもエクスポート
export const saveServiceOptions = baseOptions;

// NOTE: drizzleBase ではスキーマの parse/validation のみに責務を限定すること。
// ドメイン固有のロジック（外部サービス連携や判定処理など）は
// src/features/save/services/server/wrappers/ 以下にラップを作成して差し替えること。

// mediaUploader / mediaUploaderMulti 列が参照する Storage ファイルを、物理削除時に
// 自動クリーンアップする。media を持たないドメインでは [] となり no-op。
const storageCleanupFields = extractStorageFields(conf);

export const base = createCrudService(SaveTable, {
  ...baseOptions,
  sortOrderColumn,
  storageCleanupFields,
  parseCreate: (data) => SaveCreateSchema.parse(data),
  parseUpdate: (data) => SaveUpdateSchema.parse(data),
  parseUpsert: (data) => SaveCreateSchema.parse(data),
});
