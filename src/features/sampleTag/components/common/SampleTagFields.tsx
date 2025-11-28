// src/features/sampleTag/components/common/SampleTagFields.tsx

import { useMemo } from "react";
import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import {
  DomainFieldRenderer,
  type DomainFieldRenderConfig,
  type DomainMediaState,
} from "@/components/Form/DomainFieldRenderer";
import domainConfig from "@/features/sampleTag/domain.json";

export type SampleTagFieldsProps<TFieldValues extends FieldValues> = {
  methods: UseFormReturn<TFieldValues>;
  onMediaStateChange?: (state: DomainMediaState | null) => void;
};

export function SampleTagFields<TFieldValues extends FieldValues>({
  methods,
  onMediaStateChange,
}: SampleTagFieldsProps<TFieldValues>) {
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