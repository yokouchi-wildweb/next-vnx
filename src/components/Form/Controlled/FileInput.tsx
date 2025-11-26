// src/components/Form/Controlled/FileInput.tsx

import { FileInput as ManualFileInput } from "@/components/Form/Manual";
import { FieldPath, FieldValues } from "react-hook-form";
import type { ControlledInputProps } from "@/types/form";

export type FileInputProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = Omit<ControlledInputProps<TFieldValues, TName>, "onSelect"> & {
  initialUrl?: string | null;
  onFileSelect?: (file: File | null) => void;
  onRemove?: () => boolean | Promise<boolean>;
  containerClassName?: string;
  selectedFileName?: string | null;
};

export const FileInput = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  field,
  ...rest
}: FileInputProps<TFieldValues, TName>) => {
  const { ref: fieldRef, onChange, value, ...fieldRest } = field;
  const { onFileSelect, ...restProps } = rest;

  return (
    <ManualFileInput
      {...restProps}
      {...fieldRest}
      ref={fieldRef}
      value={(value as File | null) ?? null}
      onValueChange={(file) => onChange(file)}
      onFileSelect={onFileSelect}
    />
  );
};
