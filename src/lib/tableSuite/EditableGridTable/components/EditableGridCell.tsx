"use client";

import React from "react";
import { Input } from "@/components/Form/Manual";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Shadcn/select";
import { cn } from "@/lib/cn";

import { TableCell } from "../../DataTable/components";
import type { EditableGridColumn } from "../types";
import { formatCellValue, parseCellValue, readCellValue } from "../utils/value";
import { CellErrorIndicator } from "./CellErrorIndicator";

type EditableGridCellProps<T> = {
  row: T;
  rowKey: React.Key;
  column: EditableGridColumn<T>;
  fallbackPlaceholder: string;
  onValidChange?: (value: unknown) => void;
};

const inputBaseClassName =
  "h-full w-full rounded-none border-0 bg-transparent px-2.5 py-1 text-sm shadow-none focus-visible:border-0 focus-visible:ring-0 focus-visible:ring-offset-0";

export function EditableGridCell<T>({
  row,
  rowKey,
  column,
  fallbackPlaceholder,
  onValidChange,
}: EditableGridCellProps<T>) {
  const baseValue = React.useMemo(() => formatCellValue(row, column), [row, column]);
  const [draftValue, setDraftValue] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const inputValue = draftValue ?? baseValue ?? "";

  React.useEffect(() => {
    if (draftValue === null) {
      setError(null);
    }
  }, [baseValue, draftValue]);

  const handleCommit = (next?: string) => {
    const pendingValue = next ?? inputValue;
    const normalized = parseCellValue(pendingValue, row, column);
    const errorMessage = column.validator ? column.validator(normalized, row) : null;

    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    setError(null);
    setDraftValue(null);
    onValidChange?.(normalized);
  };

  const handleCancel = () => {
    setDraftValue(null);
    setError(null);
  };

  const sharedInputProps = {
    className: cn(
      inputBaseClassName,
      error && "aria-invalid:border-destructive aria-invalid:ring-destructive/30",
    ),
    value: inputValue,
    placeholder: fallbackPlaceholder,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => setDraftValue(event.target.value),
    onBlur: () => handleCommit(),
    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleCommit();
        inputRef.current?.blur();
      }
      if (event.key === "Escape") {
        event.preventDefault();
        handleCancel();
      }
    },
    ref: (node: HTMLInputElement | null) => {
      inputRef.current = node;
    },
  };

  const renderEditor = () => {
    switch (column.editorType) {
      case "text":
        return <Input type="text" {...sharedInputProps} />;
      case "number":
        return <Input type="number" inputMode="decimal" {...sharedInputProps} />;
      case "select":
        const EMPTY_VALUE = "__EMPTY__";
        const selectValue = inputValue === "" ? EMPTY_VALUE : inputValue;

        return (
          <Select
            value={selectValue}
            onValueChange={(value) => {
              const resolvedValue = value === EMPTY_VALUE ? "" : value;
              setDraftValue(resolvedValue);
              handleCommit(resolvedValue);
            }}
          >
            <SelectTrigger
              className={cn(
                "h-full w-full rounded-none border-0 bg-transparent px-2 py-0 text-sm shadow-none focus-visible:ring-0 focus-visible:ring-offset-0",
                error && "border border-destructive",
              )}
            >
              <SelectValue placeholder={fallbackPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={EMPTY_VALUE}>
                {column.placeholder ?? fallbackPlaceholder}
              </SelectItem>
              {(column.options ?? []).map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "date":
        return (
          <Input
            type="date"
            {...sharedInputProps}
            onFocus={(event) => {
              if (typeof (event.target as HTMLInputElement).showPicker === "function") {
                (event.target as HTMLInputElement).showPicker();
              }
            }}
          />
        );
      case "time":
        return <Input type="time" {...sharedInputProps} />;
      case "datetime":
        return (
          <Input
            type="datetime-local"
            {...sharedInputProps}
            onFocus={(event) => {
              if (typeof (event.target as HTMLInputElement).showPicker === "function") {
                (event.target as HTMLInputElement).showPicker();
              }
            }}
          />
        );
      default:
        return <Input type="text" {...sharedInputProps} />;
    }
  };

  const cellKey = `${String(rowKey)}-${column.field}`;
  const hasError = Boolean(error);
  return (
    <TableCell
      key={cellKey}
      className={cn(
        "relative p-0 text-sm cursor-default border border-border/70",
        hasError && "bg-destructive/10 ring-1 ring-inset ring-destructive/50",
      )}
      style={column.width ? { width: column.width } : undefined}
    >
      <div className={cn("group relative flex h-full items-center")}>
        {renderEditor()}
        {hasError ? <CellErrorIndicator message={error ?? ""} /> : null}
      </div>
    </TableCell>
  );
}
