// src/lib/storage/domainIntegration/wrappers.ts

import { getDomainConfig } from "@/features/core/domainConfig/getDomainConfig";
import { extractStorageFields } from "./extractStorageFields";
import { cleanupStorageFiles } from "./cleanupFiles";

type BaseService = {
  get: (id: string) => Promise<Record<string, unknown> | undefined>;
  remove: (id: string) => Promise<void>;
  bulkDeleteByIds?: (ids: string[]) => Promise<void>;
};

/**
 * ストレージ連携対応のremoveを作成
 *
 * @example
 * // wrappers/remove.ts
 * import { createStorageAwareRemove } from "@/lib/storage/domainIntegration";
 * import { base } from "../drizzleBase";
 * export const remove = createStorageAwareRemove(base, "sample");
 */
export function createStorageAwareRemove<T extends BaseService>(
  base: T,
  domainKey: string
): (id: string) => Promise<void> {
  const storageFields = extractStorageFields(getDomainConfig(domainKey));

  return async (id: string): Promise<void> => {
    if (storageFields.length) {
      const record = await base.get(id);
      if (record) {
        await cleanupStorageFiles(record, storageFields);
      }
    }
    await base.remove(id);
  };
}

/**
 * ストレージ連携対応のbulkDeleteByIdsを作成
 *
 * @example
 * // wrappers/bulkDeleteByIds.ts
 * import { createStorageAwareBulkDeleteByIds } from "@/lib/storage/domainIntegration";
 * import { base } from "../drizzleBase";
 * export const bulkDeleteByIds = createStorageAwareBulkDeleteByIds(base, "sample");
 */
export function createStorageAwareBulkDeleteByIds<T extends BaseService>(
  base: T,
  domainKey: string
): (ids: string[]) => Promise<void> {
  const storageFields = extractStorageFields(getDomainConfig(domainKey));

  return async (ids: string[]): Promise<void> => {
    if (storageFields.length && ids.length) {
      const records = await Promise.all(ids.map((id) => base.get(id)));
      await Promise.all(
        records
          .filter((r): r is Record<string, unknown> => r !== undefined)
          .map((r) => cleanupStorageFiles(r, storageFields))
      );
    }
    await base.bulkDeleteByIds?.(ids);
  };
}
