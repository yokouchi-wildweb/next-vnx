// src/features/foo/entities/drizzle.ts

import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const FooTable = pgTable("fooes", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  main_media: text("main_media"),
  filesize: integer("filesize"),
  media_width: integer("media_width"),
  media_height: text("media_height"),
  mimetype: text("mimetype"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
