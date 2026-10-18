// src/features/save/hooks/useReplaceByQuerySave.ts

"use client";

import { useReplaceByQueryDomain } from "@/lib/crud/hooks";
import { saveClient } from "../services/client/saveClient";
import type { Save } from "../entities";
import type { SaveCreateFields } from "../entities/form";

export const useReplaceByQuerySave = () => {
  const replaceByQuery = saveClient.replaceByQuery;

  if (!replaceByQuery) {
    throw new Error("Saveの条件指定一括置換機能が利用できません");
  }

  return useReplaceByQueryDomain<Save, SaveCreateFields>(
    "saves/replace-by-query",
    replaceByQuery,
    "saves",
  );
};
