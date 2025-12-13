// src/features/sampleTag/services/server/wrappers/remove.ts

import { createStorageAwareRemove } from "@/lib/storage/domainIntegration";
import { base } from "../drizzleBase";

export const remove = createStorageAwareRemove(base, "sampleTag");
