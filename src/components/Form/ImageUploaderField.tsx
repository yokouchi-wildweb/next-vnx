"use client";

// src/components/Form/ImageUploaderField.tsx

import { useCallback } from "react";
import { useFormContext, type FieldValues, type FieldPath, type Control, type UseFormReturn } from "react-hook-form";
import { FormFieldItem } from "./FormFieldItem";
import { FileUrlInput } from "./Controlled";
import { useImageUploaderField } from "@/hooks/useImageUploaderField";

export type ImageUploaderFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  name: TName;
  label: string;
  uploadPath: string;
  initialUrl?: string | null;
  onPendingChange?: (pending: boolean) => void;
  control?: Control<TFieldValues, any, TFieldValues>;
  methods?: UseFormReturn<TFieldValues>;
};

export function ImageUploaderField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  name,
  label,
  uploadPath,
  initialUrl,
  onPendingChange,
  control,
  methods,
}: ImageUploaderFieldProps<TFieldValues, TName>) {
  const formMethods = methods ?? useFormContext<TFieldValues>();
  const formControl = control ?? formMethods.control;
  const { upload, remove } = useImageUploaderField(formMethods, name, uploadPath);

  const handlePendingChange = useCallback(
    (pending: boolean) => {
      onPendingChange?.(pending);
    },
    [onPendingChange],
  );

  return (
    <>
      <FormFieldItem
        control={formControl}
        name={name}
        label={label}
        renderInput={(field) => (
          <FileUrlInput
            field={field as any}
            accept="image/*"
            initialUrl={initialUrl ?? undefined}
            onUpload={upload}
            onDelete={remove}
            onPendingChange={handlePendingChange}
          />
        )}
      />
    </>
  );
}
