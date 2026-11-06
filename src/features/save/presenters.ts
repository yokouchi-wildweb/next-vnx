// src/features/save/presenters.ts

import type { Save } from "@/features/save/entities";
import type { FieldPresenter } from "@/lib/crud";
import {
  formatBoolean,
  formatNumber,
  formatString,
  formatStringArray,
  formatEnumLabel,
  formatDateValue,
  formatMediaThumbnail,
  formatMediaThumbnails,
} from "@/lib/crud";
import { formatDateJa } from "@/utils/date";

export type SaveFieldPresenter = FieldPresenter<Save>;

export const presenters: Record<string, SaveFieldPresenter> = {
  scenario_id: ({ value, field, record }) => formatString(value),
  slot_number: ({ value, field, record }) => formatNumber(value),
  playhead: ({ value, field, record }) => formatString(value),
  play_state: ({ value, field, record }) => formatString(value),
  thumbnail: ({ value, field, record }) => formatString(value),
  play_time: ({ value, field, record }) => formatNumber(value),
  createdAt: ({ value }) => formatDateValue(value, "YYYY/MM/DD HH:mm", (val, fmt) => formatDateJa(val, { format: fmt, fallback: null })),
  updatedAt: ({ value }) => formatDateValue(value, "YYYY/MM/DD HH:mm", (val, fmt) => formatDateJa(val, { format: fmt, fallback: null })),
};

export default presenters;

