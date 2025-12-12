// src/features/__domain__/services/server/wrappers/duplicate.ts

import { createStorageAwareDuplicate } from "@/lib/storage/domainIntegration";
import { base } from "../__serviceBase__";

export const duplicate = createStorageAwareDuplicate(base, "__domain__");
