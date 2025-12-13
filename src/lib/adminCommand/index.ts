// src/lib/adminCommand/index.ts

// Types
export type {
  AdminCommand,
  CommandCategory,
  CommandContext,
  CommandResult,
} from "./types";
export { CATEGORY_LABELS } from "./types";

// Registry
export {
  adminCommandRegistry,
  registerAdminCommand,
  registerAdminCommands,
} from "./registry";

// Components
export { AdminCommandProvider, useAdminCommand } from "./components/AdminCommandProvider";
export { AdminCommandPalette } from "./components/AdminCommandPalette";

// Commands
export { registerDefaultCommands, navigationCommands } from "./commands";
