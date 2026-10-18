// src/features/save/entities/model.ts

import type { User } from "@/features/user/entities/model";

export type Save = {
  id: string;
  user_id: string;
  scenario_id: string;
  slot_number: number;
  playhead: any;
  play_state: any | null;
  thumbnail: string | null;
  play_time: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

/**
 * リレーション展開済みの Save 型。
 * withRelations: true オプション使用時に返される。
 */
export type SaveWithRelations = Save & {
  /** belongsTo: ユーザー */
  user?: User | null;
};
