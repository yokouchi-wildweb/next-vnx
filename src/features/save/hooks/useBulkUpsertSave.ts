// src/features/save/hooks/useBulkUpsertSave.ts

"use client";

import { useBulkUpsertDomain } from "@/lib/crud/hooks";
import { saveClient } from "../services/client/saveClient";
import type { Save } from "../entities";
import type { SaveCreateFields } from "../entities/form";

export const useBulkUpsertSave = () => {
  const bulkUpsert = saveClient.bulkUpsert;

  if (!bulkUpsert) {
    throw new Error("Saveの一括アップサート機能が利用できません");
  }

  return useBulkUpsertDomain<Save, SaveCreateFields>(
    "saves/bulk-upsert",
    bulkUpsert,
    "saves",
  );
};
