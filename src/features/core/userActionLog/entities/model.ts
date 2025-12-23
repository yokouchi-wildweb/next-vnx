// src/features/core/userActionLog/entities/model.ts

import type { UserActionActorType, UserActionType } from "../constants";

export type UserActionLog = {
  id: string;
  targetUserId: string;
  actorId: string | null;
  actorType: UserActionActorType;
  actionType: UserActionType;
  beforeValue: unknown;
  afterValue: unknown;
  reason: string | null;
  createdAt: Date;
};
