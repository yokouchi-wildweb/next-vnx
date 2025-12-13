// src/lib/adminCommand/index.ts

// Types
export type {
  CategoryRendererProps,
  NavigationItem,
  SettingFieldConfig,
  SettingInputType,
  PaletteView,
} from "./types";

// Categories
export { categories, type CategoryConfig } from "./categories";

// Definitions
export { navigationItems, settingFields } from "./definitions";

// Components
export { AdminCommandProvider, useAdminCommand } from "./components/AdminCommandProvider";
export { AdminCommandPalette } from "./components/AdminCommandPalette";
