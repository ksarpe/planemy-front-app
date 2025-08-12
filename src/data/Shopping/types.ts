// Constants and simple types used by Shopping UI

// Common quantity units used when adding items
export const SHOPPING_UNITS = ["szt", "kg", "g", "l", "ml", "opak.", "puszka", "butelka"] as const;
export type ShoppingUnit = (typeof SHOPPING_UNITS)[number];
export const SHOPPING_LIST_COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#6B7280",
  "#84CC16",
] as const;
