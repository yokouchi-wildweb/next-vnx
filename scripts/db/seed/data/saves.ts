// scripts/db/seed/data/saves.ts

import { db } from "@/lib/drizzle";
import { SaveTable } from "@/features/save/entities/drizzle";
import type { SeedDemoUserResult } from "./demoUser";
import fs from "fs";
import path from "path";

export type SeedSavesResult = {
  slot1: typeof SaveTable.$inferSelect;
};

export async function seedSaves(
  demoUser: SeedDemoUserResult | undefined,
): Promise<SeedSavesResult> {
  console.log("  → セーブデータを作成中...");

  // デモユーザーは seedRegistry の deps: ["demoUser"] の戻り値(ユーザー行)を受け取る
  if (!demoUser) {
    console.log("  ⚠ デモユーザーがいません（スキップ）");
    return { slot1: null as unknown as typeof SaveTable.$inferSelect };
  }

  // slot1.json を読み込み
  const jsonPath = path.resolve(
    process.cwd(),
    "public/game/scenarios/_sample/saves/slot1.json"
  );
  const jsonData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

  // DB に挿入
  const [slot1] = await db
    .insert(SaveTable)
    .values({
      user_id: demoUser.id,
      scenario_id: jsonData.scenarioId,
      slot_number: jsonData.slotNumber,
      playhead: jsonData.playhead,
      play_state: jsonData.playState,
      thumbnail: jsonData.thumbnail,
      play_time: jsonData.playTime,
    })
    .returning();

  console.log(`    ✓ スロット${slot1.slot_number} (${slot1.scenario_id})`);

  return { slot1 };
}
