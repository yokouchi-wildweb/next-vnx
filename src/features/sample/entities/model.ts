// src/features/sample/entities/model.ts

export type Sample = {
  id: string;
  sample_category_id: string | null;
  sample_tag_ids?: string[];
  name: string;
  number: number | null;
  rich_number: number | null;
  switch: boolean | null;
  radio: boolean | null;
  select: 'apple' | 'orange' | 'berry' | null;
  multi_select: string[];
  sale_start_at: Date | null;
  date: string | null;
  time: string | null;
  main_image: string | null;
  sub_image: string | null;
  description: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};
