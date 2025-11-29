// src/features/foo/entities/model.ts

export type Foo = {
  id: string;
  name: string | null;
  main_media: string | null;
  filesize: number | null;
  media_width: number | null;
  media_height: string | null;
  mimetype: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};
