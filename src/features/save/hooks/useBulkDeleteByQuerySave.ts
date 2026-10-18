// src/features/save/hooks/useBulkDeleteByQuerySave.ts

"use client";

import { useBulkDeleteByQueryDomain } from "@/lib/crud/hooks";
import { saveClient } from "../services/client/saveClient";

export const useBulkDeleteByQuerySave = () => {
  const bulkDeleteByQuery = saveClient.bulkDeleteByQuery;

  if (!bulkDeleteByQuery) {
    throw new Error("Saveの条件指定一括削除機能が利用できません");
  }

  return useBulkDeleteByQueryDomain("saves/bulk-delete-by-query", bulkDeleteByQuery, "saves");
};
