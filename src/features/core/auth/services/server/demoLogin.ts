// src/features/core/auth/services/server/demoLogin.ts

import { v4 as uuidv4 } from "uuid";

import { SessionUserSchema } from "@/features/core/auth/entities/session";
import type { SessionUser } from "@/features/core/auth/entities/session";
import { userService } from "@/features/core/user/services/server/userService";
import { UserTable } from "@/features/core/user/entities/drizzle";
import { GeneralUserSchema } from "@/features/core/user/entities/schema";
import { demoModeConfig } from "@/config/app/demo-mode.config";
import { DEMO_SESSION_MAX_AGE_SECONDS } from "@/constants/session";
import { db } from "@/lib/drizzle";
import { signUserToken } from "@/lib/jwt";

const DEMO_USER_PROVIDER_TYPE = "custom";

export type DemoLoginInput = {
  demoUserId?: string | null;
};

export type DemoLoginResult = {
  user: SessionUser;
  demoUserId: string;
  isNewUser: boolean;
  session: {
    token: string;
    expiresAt: Date;
    maxAge: number;
  };
};

/**
 * 新しいデモユーザーを作成する。
 */
async function createDemoUser() {
  const providerUid = `demo-user-${uuidv4()}`;

  const values = await GeneralUserSchema.parseAsync({
    role: "user",
    status: "active",
    providerType: DEMO_USER_PROVIDER_TYPE,
    providerUid,
    isDemo: true,
    email: null,
    localPassword: null,
    displayName: "デモユーザー",
  });

  const [user] = await db.insert(UserTable).values(values).returning();

  return user;
}

/**
 * デモユーザーでのログイン処理。
 * demoUserId が指定されていればそのユーザーでログイン、なければ新規作成。
 */
export async function demoLogin(input: DemoLoginInput = {}): Promise<DemoLoginResult> {
  const { demoUserId } = input;

  let user;
  let isNewUser = false;

  if (demoUserId) {
    // 既存ユーザーを検索
    user = await userService.get(demoUserId);

    // 見つからない、または無効な場合は新規作成
    if (!user || !user.isDemo || user.status !== "active") {
      user = null;
    }
  }

  // ユーザーが取得できなかった場合は新規作成
  if (!user) {
    user = await createDemoUser();
    isNewUser = true;

    // 拡張ポイント：関連レコードの挿入
    await demoModeConfig.onUserCreated(user.id);
  }

  // 最終認証日時を更新
  await userService.updateLastAuthenticated(user.id);

  // セッションに格納する情報をスキーマで整形
  const sessionUser = SessionUserSchema.parse({
    userId: user.id,
    role: user.role,
    status: user.status,
    isDemo: user.isDemo,
    providerType: user.providerType,
    providerUid: user.providerUid,
    displayName: user.displayName,
  });

  // JWT の存続期間を定義し、トークンを署名（デモユーザーは短いセッション時間）
  const maxAge = DEMO_SESSION_MAX_AGE_SECONDS;
  const { token, expiresAt } = await signUserToken({
    subject: sessionUser.userId,
    claims: {
      role: sessionUser.role,
      status: sessionUser.status,
      isDemo: sessionUser.isDemo,
      providerType: sessionUser.providerType,
      providerUid: sessionUser.providerUid,
      displayName: sessionUser.displayName,
    },
    options: { maxAge },
  });

  return {
    user: sessionUser,
    demoUserId: user.id,
    isNewUser,
    session: {
      token,
      expiresAt,
      maxAge,
    },
  };
}
