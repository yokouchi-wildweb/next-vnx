// src/features/user/constants/status.ts

import { USER_STATUSES } from "@/constants/user";
import type { Options } from "@/types/form";
import type { UserStatus } from "@/types/user";

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  pending: "仮登録",
  active: "有効",
  inactive: "休止中",
  suspended: "一時停止",
  banned: "永久追放",
  security_locked: "セキュリティロック",
  withdrawn: "退会済み",
};

export const USER_STATUS_OPTIONS: Options[] = USER_STATUSES.map((status) => ({
  value: status,
  label: USER_STATUS_LABELS[status] ?? status,
}));

export const formatUserStatusLabel = (
  status: string | null | undefined,
  fallback = "",
): string => {
  if (!status) {
    return fallback;
  }
  return USER_STATUS_LABELS[status as UserStatus] ?? status;
};
