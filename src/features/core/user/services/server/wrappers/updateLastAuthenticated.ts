// src/features/user/services/server/wrappers/updateLastAuthenticated.ts

import { eq } from "drizzle-orm";

import { UserTable } from "@/features/core/user/entities/drizzle";
import { db } from "@/lib/drizzle";

/**
 * ユーザーの最終認証日時を更新する。
 * ログイン成功時に呼び出される。
 */
export async function updateLastAuthenticated(userId: string): Promise<void> {
  const now = new Date();

  await db
    .update(UserTable)
    .set({ lastAuthenticatedAt: now, updatedAt: now })
    .where(eq(UserTable.id, userId));
}
