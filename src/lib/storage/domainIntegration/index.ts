// src/lib/storage/domainIntegration/index.ts

export { extractStorageFields } from "./extractStorageFields";
export { cleanupStorageFiles } from "./cleanupFiles";
export { createStorageAwareRemove, createStorageAwareBulkDeleteByIds } from "./wrappers";
