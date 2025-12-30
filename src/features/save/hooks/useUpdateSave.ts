// src/features/save/hooks/useUpdateSave.ts

"use client";

import { useUpdateDomain } from "@/lib/crud/hooks";
import { saveClient } from "../services/client/saveClient";
import type { Save } from "../entities";
import type { SaveUpdateFields } from "../entities/form";

export const useUpdateSave = () =>
  useUpdateDomain<Save, SaveUpdateFields>(
    "saves/update",
    saveClient.update,
    "saves",
  );
