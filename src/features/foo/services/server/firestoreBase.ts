// src/features/foo/services/server/firestoreBase.ts

import { createCrudService } from "@/lib/crud/firestore";
import type { CreateCrudServiceOptions } from "@/lib/crud/types";
import type { Foo } from "@/features/foo/entities";
import { FooCreateSchema, FooUpdateSchema } from "@/features/foo/entities/schema";

export const baseOptions = {
  idType: "uuid",
  useCreatedAt: true,
  useUpdatedAt: true,
  defaultSearchFields: [
    "name"
  ],
} satisfies CreateCrudServiceOptions;

// 互換性のためエイリアスもエクスポート
export const fooServiceOptions = baseOptions;

export const base = createCrudService<Foo>("foo", {
  ...baseOptions,
  parseCreate: (data) => FooCreateSchema.parse(data),
  parseUpdate: (data) => FooUpdateSchema.parse(data),
  parseUpsert: (data) => FooCreateSchema.parse(data),
});
