// src/features/core/domainConfig/getDomainConfig.ts
// ドメイン設定 (domain.json) を取得するユーティリティ。

import sampleConfig from "@/features/sample/domain.json";
import sampleCategoryConfig from "@/features/sampleCategory/domain.json";
import sampleTagConfig from "@/features/sampleTag/domain.json";

const domainConfigMap = {
  sample: sampleConfig,
  sample_category: sampleCategoryConfig,
  sample_tag: sampleTagConfig,
} as const;

export type DomainKey = keyof typeof domainConfigMap;
export type DomainConfig = (typeof domainConfigMap)[DomainKey];

export function getDomainConfig<T extends DomainKey>(domain: T): (typeof domainConfigMap)[T] {
  const config = domainConfigMap[domain];
  if (!config) {
    throw new Error(`Domain config not found: ${domain}`);
  }
  return config;
}
