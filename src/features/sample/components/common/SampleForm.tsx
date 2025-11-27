// src/features/undefined/components/common/SampleForm.tsx

"use client";

import { AppForm } from "@/components/Form/AppForm";
import { Button } from "@/components/Form/Button/Button";
import { SampleFields, type SampleFieldsProps } from "./SampleFields";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import { useState } from "react";

export type SampleFormProps<TFieldValues extends FieldValues> =
  Omit<SampleFieldsProps<TFieldValues>, 'control'> & {
    methods: UseFormReturn<TFieldValues>;
    onSubmitAction: (data: TFieldValues) => Promise<void>;
    isMutating?: boolean;
    submitLabel: string;
    processingLabel: string;
    onCancel?: () => void;
  };

export function SampleForm<TFieldValues extends FieldValues>({
  methods,
  onSubmitAction,
  isMutating = false,
  submitLabel,
  processingLabel,
  onCancel,
  ...fieldsProps
}: SampleFormProps<TFieldValues>) {
  const {
    control,
    formState: { isSubmitting },
  } = methods;

  const loading = isSubmitting || isMutating;
  const [isUploading, setUploading] = useState(false);
  const disabled = loading || isUploading;

  return (
    <AppForm
      methods={methods}
      onSubmit={onSubmitAction}
      pending={disabled}
      fieldSpace="md"
    >
      <SampleFields<TFieldValues> {...fieldsProps} control={control} onUploadingChange={setUploading} />
      <div className="flex justify-center gap-3">
        <Button type="submit" disabled={disabled} variant="default">
          {disabled ? processingLabel : submitLabel}
        </Button>
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel}>
            キャンセル
          </Button>
        ) : null}
      </div>
    </AppForm>
  );
}
