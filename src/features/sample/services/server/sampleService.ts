// src/features/sample/services/server/sampleService.ts

import { base } from "./drizzleBase";
import { remove } from "./wrappers/remove";

export const sampleService = {
  ...base,
  remove,
};
