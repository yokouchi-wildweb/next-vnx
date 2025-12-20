// src/features/user/services/server/finders/checkAdminUserExists.ts

import { eq } from "drizzle-orm";

import { UserTable } from "@/features/core/user/entities/drizzle";
import { db } from "@/lib/drizzle";

/**
 * 管理者ユーザーが存在するかを確認する。
 * 初期セットアップ時の判定に使用する。
 */
export async function checkAdminUserExists(): Promise<boolean> {
  const adminUser = await db.query.UserTable.findFirst({
    columns: { id: true },
    where: eq(UserTable.role, "admin"),
  });

  return Boolean(adminUser);
}
