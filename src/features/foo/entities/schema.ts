// src/features/foo/entities/schemaRegistry.ts

import { emptyToNull } from "@/utils/string";
import { z } from "zod";

export const FooBaseSchema = z.object({
  name: z.string().trim().nullish()
    .transform((value) => emptyToNull(value) ?? null),
  num: z.coerce.number().int().nullish()
    .transform((value) => value ?? null),
});

export const FooCreateSchema = FooBaseSchema;

export const FooUpdateSchema = FooBaseSchema.partial();
