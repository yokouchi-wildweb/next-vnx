// src/features/sampleCategory/components/common/SampleCategoryFields.tsx

import { useMemo } from "react";
import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import {
  DomainFieldRenderer,
  type DomainFieldRenderConfig,
  type DomainMediaState,
} from "@/components/Form/DomainFieldRenderer";
import domainConfig from "@/features/sampleCategory/domain.json";

export type SampleCategoryFieldsProps<TFieldValues extends FieldValues> = {
  methods: UseFormReturn<TFieldValues>;
  onMediaStateChange?: (state: DomainMediaState | null) => void;
};

export function SampleCategoryFields<TFieldValues extends FieldValues>({
  methods,
  onMediaStateChange,
}: SampleCategoryFieldsProps<TFieldValues>) {
  const relationFieldConfigs = useMemo<DomainFieldRenderConfig<TFieldValues, FieldPath<TFieldValues>>[]>(
    () => [],
    [],
  );

  return (
    <DomainFieldRenderer
      control={methods.control}
      methods={methods}
      fields={relationFieldConfigs}
      domainJsonFields={domainConfig.fields ?? []}
      onMediaStateChange={onMediaStateChange}
    />
  );
}