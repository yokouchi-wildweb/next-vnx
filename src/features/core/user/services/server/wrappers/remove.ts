// src/features/user/services/server/wrappers/remove.ts
// ソフトデリート: deletedAt を設定するのみ（Firebase Authは削除しない）

import { base } from "../drizzleBase";

export async function remove(id: string): Promise<void> {
  await base.remove(id);
}
