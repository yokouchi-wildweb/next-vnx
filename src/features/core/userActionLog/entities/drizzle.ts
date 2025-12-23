// src/features/core/userActionLog/entities/drizzle.ts

import { index, jsonb, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { USER_ACTION_ACTOR_TYPES, USER_ACTION_TYPES } from "../constants";

export const UserActionTypeEnum = pgEnum("user_action_type", [...USER_ACTION_TYPES]);
export const UserActionActorTypeEnum = pgEnum("user_action_actor_type", [...USER_ACTION_ACTOR_TYPES]);

export const UserActionLogTable = pgTable(
  "user_action_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    targetUserId: uuid("target_user_id").notNull(),
    actorId: uuid("actor_id"),
    actorType: UserActionActorTypeEnum("actor_type").notNull(),
    actionType: UserActionTypeEnum("action_type").notNull(),
    beforeValue: jsonb("before_value"),
    afterValue: jsonb("after_value"),
    reason: text("reason"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    targetUserIdIdx: index("user_action_logs_target_user_id_idx").on(table.targetUserId),
    actorIdIdx: index("user_action_logs_actor_id_idx").on(table.actorId),
    actionTypeIdx: index("user_action_logs_action_type_idx").on(table.actionType),
    createdAtIdx: index("user_action_logs_created_at_idx").on(table.createdAt),
  }),
);
