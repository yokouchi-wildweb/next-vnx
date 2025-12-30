// src/features/save/entities/form.ts

import { z } from "zod";
import { SaveCreateSchema, SaveUpdateSchema } from "./schema";

export type SaveCreateAdditional = {
  // foo: string; フォームに追加する項目
};
export type SaveCreateFields = z.infer<typeof SaveCreateSchema> & SaveCreateAdditional;

export type SaveUpdateAdditional = {
  // foo: string; フォームに追加する項目
};
export type SaveUpdateFields = z.infer<typeof SaveUpdateSchema> & SaveUpdateAdditional;
