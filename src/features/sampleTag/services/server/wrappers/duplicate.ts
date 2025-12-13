// src/features/sampleTag/services/server/wrappers/duplicate.ts

import { createStorageAwareDuplicate } from "@/lib/storage/domainIntegration";
import { base } from "../drizzleBase";

export const duplicate = createStorageAwareDuplicate(base, "sampleTag");
