// src/features/save/hooks/useSearchSave.ts

"use client";

import { useSearchDomain } from "@/lib/crud/hooks";
import { saveClient } from "../services/client/saveClient";
import type { Save } from "../entities";
import type { SearchParams } from "@/lib/crud/types";

export type SaveSearchParams = typeof saveClient.search extends (
  params: infer P,
) => Promise<unknown>
  ? P
  : SearchParams;

export const useSearchSave = (params: SaveSearchParams) => {
  const search = saveClient.search;

  if (!search) {
    throw new Error("Saveの検索機能が利用できません");
  }

  return useSearchDomain<Save, SaveSearchParams>(
    "saves/search",
    search,
    params,
  );
};
