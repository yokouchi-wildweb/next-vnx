// src/components/Form/Controlled/DateInput.tsx

import { DateInput as ManualDateInput } from "@/components/Form/Manual";
import { FieldPath, FieldValues } from "react-hook-form";
import { ControlledInputProps } from "@/types/form";

export const DateInput = <TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  field,
  ...rest
}: ControlledInputProps<TFieldValues, TName>) => {
  const { ref: fieldRef, onChange, value, ...fieldRest } = field;

  return (
    <ManualDateInput
      {...rest}
      {...fieldRest}
      ref={fieldRef}
      value={value}
      onValueChange={(newValue) => onChange(newValue)}
    />
  );
};
