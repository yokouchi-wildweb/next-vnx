// src/features/save/hooks/useSaveList.ts

"use client";

import { useDomainList } from "@/lib/crud/hooks";
import { saveClient } from "../services/client/saveClient";
import type { Save } from "../entities";
import type { SWRConfiguration } from "swr";

export const useSaveList = (config?: SWRConfiguration) =>
  useDomainList<Save>("saves", saveClient.getAll, config);
