// src/features/save/entities/model.ts

export type Save = {
  id: string;
  user_id: string;
  scenario_id: string;
  slot_number: number;
  play_state: any;
  thumbnail: string | null;
  play_time: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};
