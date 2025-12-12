// src/lib/storage/domainIntegration/index.ts

export { extractStorageFields } from "./extractStorageFields";
export { cleanupStorageFiles } from "./cleanupFiles";
export { duplicateStorageFiles } from "./duplicateFiles";
export {
  createStorageAwareRemove,
  createStorageAwareBulkDeleteByIds,
  createStorageAwareDuplicate,
} from "./wrappers";
