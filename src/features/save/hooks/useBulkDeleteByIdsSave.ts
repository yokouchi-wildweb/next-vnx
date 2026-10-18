// src/features/save/hooks/useBulkDeleteByIdsSave.ts

"use client";

import { useBulkDeleteByIdsDomain } from "@/lib/crud/hooks";
import { saveClient } from "../services/client/saveClient";

export const useBulkDeleteByIdsSave = () => {
  const bulkDeleteByIds = saveClient.bulkDeleteByIds;

  if (!bulkDeleteByIds) {
    throw new Error("Saveの一括削除機能が利用できません");
  }

  return useBulkDeleteByIdsDomain("saves/bulk-delete-by-ids", bulkDeleteByIds, "saves");
};
