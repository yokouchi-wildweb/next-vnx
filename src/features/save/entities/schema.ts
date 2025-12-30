// src/features/save/entities/schemaRegistry.ts

import { emptyToNull } from "@/utils/string";
import { z } from "zod";

export const SaveBaseSchema = z.object({
  user_id: z.string().trim().min(1, { message: "ユーザーは必須です。" }),
  scenario_id: z.string().trim().min(1, { message: "シナリオIDは必須です。" }),
  slot_number: z.coerce.number().int(),
  playhead: z.unknown().refine((v) => v != null, { message: "再生位置は必須です。" }),
  play_state: z.unknown().nullish(),
  thumbnail: z.string().trim().nullish()
    .transform((value) => emptyToNull(value)),
  play_time: z.coerce.number().int().nullish(),
});

export const SaveCreateSchema = SaveBaseSchema;

export const SaveUpdateSchema = SaveBaseSchema.partial();
