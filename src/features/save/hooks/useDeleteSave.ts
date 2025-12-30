// src/features/save/hooks/useDeleteSave.ts

"use client";

import { useDeleteDomain } from "@/lib/crud/hooks";
import { saveClient } from "../services/client/saveClient";

export const useDeleteSave = () => useDeleteDomain("saves/delete", saveClient.delete, "saves");
