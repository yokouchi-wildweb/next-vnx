// src/features/core/userActionLog/services/server/drizzleBase.ts

import { UserActionLogTable } from "@/features/core/userActionLog/entities/drizzle";
import { UserActionLogCreateSchema } from "@/features/core/userActionLog/entities/schema";
import { createCrudService } from "@/lib/crud/drizzle";
import type { DrizzleCrudServiceOptions } from "@/lib/crud/drizzle/types";
import type { z } from "zod";

const baseOptions = {
  idType: "uuid",
  defaultOrderBy: [["createdAt", "DESC"]],
} satisfies DrizzleCrudServiceOptions<z.infer<typeof UserActionLogCreateSchema>>;

export const base = createCrudService(UserActionLogTable, baseOptions);
