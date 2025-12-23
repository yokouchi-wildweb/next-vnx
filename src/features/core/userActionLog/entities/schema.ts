// src/features/core/userActionLog/entities/schema.ts

import { z } from "zod";
import { USER_ACTION_ACTOR_TYPES, USER_ACTION_TYPES } from "../constants";

export const UserActionLogCreateSchema = z.object({
  targetUserId: z.string().uuid(),
  actorId: z.string().uuid().nullish(),
  actorType: z.enum(USER_ACTION_ACTOR_TYPES),
  actionType: z.enum(USER_ACTION_TYPES),
  beforeValue: z.unknown().nullish(),
  afterValue: z.unknown().nullish(),
  reason: z.string().nullish(),
});

export type UserActionLogCreateInput = z.infer<typeof UserActionLogCreateSchema>;
