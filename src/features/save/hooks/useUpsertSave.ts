// src/features/save/hooks/useUpsertSave.ts

"use client";

import { useUpsertDomain } from "@/lib/crud/hooks";
import { saveClient } from "../services/client/saveClient";
import type { Save } from "../entities";
import type { SaveCreateFields } from "../entities/form";

export const useUpsertSave = () => {
  const upsert = saveClient.upsert;

  if (!upsert) {
    throw new Error("Saveのアップサート機能が利用できません");
  }

  return useUpsertDomain<Save, SaveCreateFields>(
    "saves/upsert",
    upsert,
    "saves",
  );
};
