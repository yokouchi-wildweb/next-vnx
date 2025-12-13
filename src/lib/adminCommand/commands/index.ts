// src/lib/adminCommand/commands/index.ts

import { registerAdminCommands } from "../registry";
import { navigationCommands } from "./navigation";

/**
 * 全てのデフォルトコマンドを登録する
 */
export function registerDefaultCommands(): void {
  registerAdminCommands(navigationCommands);
}

export { navigationCommands };
