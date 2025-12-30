// src/features/save/entities/drizzle.ts

import { integer, jsonb, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { UserTable } from "@/features/user/entities/drizzle";

export const SaveTable = pgTable("saves", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: uuid("user_id").notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  scenario_id: text("scenario_id").notNull(),
  slot_number: integer("slot_number").notNull().default(0),
  play_state: jsonb("play_state").notNull(),
  thumbnail: text("thumbnail"),
  play_time: integer("play_time").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
}, (table) => [
  // 複合ユニーク制約 0: [user_id, scenario_id, slot_number]
  uniqueIndex("saves_composite_unique_0").on(table.user_id, table.scenario_id, table.slot_number)
]);
