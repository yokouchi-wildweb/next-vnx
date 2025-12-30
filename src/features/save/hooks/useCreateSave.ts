// src/features/save/hooks/useCreateSave.ts

"use client";

import { useCreateDomain } from "@/lib/crud/hooks";
import { saveClient } from "../services/client/saveClient";
import type { Save } from "../entities";
import type { SaveCreateFields } from "../entities/form";

export const useCreateSave = () =>
  useCreateDomain<Save, SaveCreateFields>("saves/create", saveClient.create, "saves");
