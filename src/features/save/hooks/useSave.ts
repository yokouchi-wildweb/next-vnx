// src/features/save/hooks/useSave.ts

"use client";

import { useDomain } from "@/lib/crud/hooks";
import { saveClient } from "../services/client/saveClient";
import type { Save } from "../entities";

export const useSave = (id?: string | null) =>
  useDomain<Save | undefined>(
    id ? `save:${id}` : null,
    () => saveClient.getById(id!) as Promise<Save>,
  );
