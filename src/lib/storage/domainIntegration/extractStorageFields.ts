// src/lib/storage/domainIntegration/extractStorageFields.ts

type DomainFieldConfig = {
  name: string;
  fieldType: string;
};

type DomainConfigForStorage = {
  fields?: DomainFieldConfig[];
};

/**
 * domainConfigからmediaUploaderフィールド名を抽出する
 */
export function extractStorageFields(domainConfig: DomainConfigForStorage): string[] {
  if (!domainConfig.fields) return [];
  return domainConfig.fields
    .filter((f) => f.fieldType === "mediaUploader")
    .map((f) => f.name);
}
