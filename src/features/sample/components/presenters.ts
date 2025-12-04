// src/features/sample/components/presenters.ts

import type { Sample } from "@/features/sample/entities";
import type { FieldPresenter } from "@/lib/crud/presenters";
import { formatBoolean, formatNumber } from "@/lib/crud/presenters";

type SampleFieldPresenter = FieldPresenter<Sample>;

export const presenters: Record<string, SampleFieldPresenter> = {
  number: ({ value }) => formatNumber(value, " 件"),
  rich_number: ({ value }) => formatNumber(value, " pt"),
  switch: ({ value }) => formatBoolean(value, "ON", "OFF"),
  radio: ({ value }) => formatBoolean(value, "はい", "いいえ"),
};

export default presenters;
