"use client";

import dayjs from "dayjs";

import type { EditableGridColumn, EditableGridEditorType } from "../types";

export const readCellValue = <T,>(row: T, column: EditableGridColumn<T>) => {
  if (column.getValue) {
    return column.getValue(row);
  }
  return (row as Record<string, unknown>)[column.field];
};

export const formatCellValue = <T,>(row: T, column: EditableGridColumn<T>) => {
  const value = readCellValue(row, column);
  if (column.formatValue) {
    return column.formatValue(value, row);
  }
  return formatByType(column.editorType, value);
};

export const parseCellValue = <T,>(inputValue: string, row: T, column: EditableGridColumn<T>) => {
  if (column.parseValue) {
    return column.parseValue(inputValue, row);
  }
  return parseByType(column.editorType, inputValue);
};

const formatByType = (type: EditableGridEditorType, value: unknown) => {
  if (type === "number") {
    if (value === "" || value === null || value === undefined) {
      return "";
    }
    return String(value);
  }

  if (type === "date") {
    const formatted = formatDateValue(value, "YYYY-MM-DD");
    return formatted ?? "";
  }

  if (type === "time") {
    const formatted = formatDateValue(value, "HH:mm");
    return formatted ?? "";
  }

  if (type === "datetime") {
    const formatted = formatDateValue(value, "YYYY-MM-DDTHH:mm");
    return formatted ?? "";
  }

  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
};

const parseByType = (type: EditableGridEditorType, value: string) => {
  if (type === "number") {
    if (value === "") {
      return null;
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }

  if (type === "date" || type === "time" || type === "datetime") {
    return value === "" ? null : value;
  }

  return value;
};

const formatDateValue = (value: unknown, format: string) => {
  if (value == null) {
    return null;
  }
  const date = dayjs(value);
  if (!date.isValid()) {
    return typeof value === "string" ? value : null;
  }
  return date.format(format);
};
