// src/features/__domain__/services/server/__domain__Service.ts

import { base } from "./__serviceBase__";
import { remove } from "./wrappers/remove";
import { duplicate } from "./wrappers/duplicate";

export const __domain__Service = {
  ...base,
  remove,
  duplicate,
};
