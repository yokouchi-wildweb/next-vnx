// src/features/save/entities/model.ts

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
