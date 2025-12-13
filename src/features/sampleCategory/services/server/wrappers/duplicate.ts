// src/features/sampleCategory/services/server/wrappers/duplicate.ts

import { createStorageAwareDuplicate } from "@/lib/storage/domainIntegration";
import { base } from "../drizzleBase";

export const duplicate = createStorageAwareDuplicate(base, "sampleCategory");
