// Constants and simple types used by Shopping UI

// Common quantity units used when adding items
export const SHOPPING_UNITS = ["szt", "kg", "g", "l", "ml", "opak.", "puszka", "butelka"] as const;
export type ShoppingUnit = (typeof SHOPPING_UNITS)[number];
export const SHOPPING_LIST_COLORS = [
  "#00B3C7", // Cyan
  "#F72585", // Pink
  "#7209B7", // Violet
  "#3A0CA3", // Indigo
  "#EAC8CA", // Rose
  "#EF4444", // Red
  "#10B981", // Green (extra)
  "#F59E0B", // Amber (extra)
] as const;
