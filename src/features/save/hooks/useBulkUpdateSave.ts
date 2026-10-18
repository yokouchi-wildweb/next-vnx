// src/features/save/hooks/useBulkUpdateSave.ts

"use client";

import { useBulkUpdateDomain } from "@/lib/crud/hooks";
import { saveClient } from "../services/client/saveClient";
import type { Save } from "../entities";
import type { SaveUpdateFields } from "../entities/form";

export const useBulkUpdateSave = () => {
  const bulkUpdate = saveClient.bulkUpdate;

  if (!bulkUpdate) {
    throw new Error("Saveの一括更新機能が利用できません");
  }

  return useBulkUpdateDomain<Save, SaveUpdateFields>(
    "saves/bulk-update",
    bulkUpdate,
    "saves",
  );
};
