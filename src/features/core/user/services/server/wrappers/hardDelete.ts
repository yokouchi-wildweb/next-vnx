// src/features/user/services/server/wrappers/hardDelete.ts
// ハードデリート: Firebase AuthとDBレコードを物理削除

import { deleteAuthUser } from "@/lib/firebase/server/authAdmin";
import { base } from "../drizzleBase";

export async function hardDelete(id: string): Promise<void> {
  // ソフトデリート済みでも取得できるようにgetWithDeletedを使用
  const user = await base.getWithDeleted(id);

  if (user?.role === "user" && user.providerUid) {
    await deleteAuthUser(user.providerUid);
  }

  await base.hardDelete(id);
}
