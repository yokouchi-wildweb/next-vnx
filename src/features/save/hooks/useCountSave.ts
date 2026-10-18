// src/features/save/hooks/useCountSave.ts

"use client";

import { useCountDomain } from "@/lib/crud/hooks";
import { saveClient } from "../services/client/saveClient";
import type { CountParams } from "@/lib/crud/types";

export const useCountSave = (params: CountParams) => {
  const count = saveClient.count;

  if (!count) {
    throw new Error("Saveのカウント機能が利用できません");
  }

  return useCountDomain<CountParams>(
    "saves/count",
    count,
    params,
  );
};
