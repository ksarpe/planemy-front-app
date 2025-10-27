/**
 * Centralized color system for labels, events, badges, etc.
 * Used across the application for consistent theming.
 */

export type ColorName = "emerald" | "amber" | "red" | "rose" | "violet";

export interface ColorConfig {
  name: ColorName;
  label: string; // Display name for UI
  hex: string; // Hex color for backend compatibility
  // Background colors for different states
  bg: string;
  bgHover: string;
  // Text color
  text: string;
  // Border color
  border: string;
}

/**
 * Available colors configuration
 * These classes work with both light and dark modes (handled by CSS variables)
 */
export const COLORS: Record<ColorName, ColorConfig> = {
  emerald: {
    name: "emerald",
    label: "Emerald",
    hex: "#10B981",
    bg: "bg-green-100",
    bgHover: "hover:bg-green-200",
    text: "text-green-900",
    border: "border-green-200",
  },
  amber: {
    name: "amber",
    label: "Amber",
    hex: "#F59E0B",
    bg: "bg-yellow-100",
    bgHover: "hover:bg-yellow-200",
    text: "text-yellow-900",
    border: "border-yellow-200",
  },
  red: {
    name: "red",
    label: "Red",
    hex: "#EF4444",
    bg: "bg-red-100",
    bgHover: "hover:bg-red-200",
    text: "text-red-900",
    border: "border-red-200",
  },
  rose: {
    name: "rose",
    label: "Rose",
    hex: "#F43F5E",
    bg: "bg-pink-100",
    bgHover: "hover:bg-pink-200",
    text: "text-pink-900",
    border: "border-pink-200",
  },
  violet: {
    name: "violet",
    label: "Violet",
    hex: "#8B5CF6",
    bg: "bg-purple-100",
    bgHover: "hover:bg-purple-200",
    text: "text-purple-900",
    border: "border-purple-200",
  },
};

/**
 * Get all available color names
 */
export const COLOR_NAMES: ColorName[] = Object.keys(COLORS) as ColorName[];

/**
 * Get color configuration by name
 */
export function getColorConfig(color?: ColorName | string): ColorConfig {
  const colorName = (color as ColorName) || "rose";
  return COLORS[colorName] || COLORS.rose;
}

/**
 * Get combined CSS classes for a color (useful for events, badges, etc.)
 */
export function getColorClasses(color?: ColorName | string): string {
  const config = getColorConfig(color);
  return `${config.bg} ${config.bgHover} ${config.text} ${config.border}`;
}

/**
 * Get badge-specific classes (no hover, smaller opacity)
 */
export function getBadgeColorClasses(color?: ColorName | string): string {
  const config = getColorConfig(color);
  return `${config.bg} ${config.text} ${config.border}`;
}

/**
 * Convert color name to hex format for backend API
 * Backend expects format: #RRGGBB
 */
export function colorNameToHex(colorName?: ColorName | string): string {
  if (!colorName) return COLORS.rose.hex;

  // If already hex format, return as-is
  if (typeof colorName === "string" && colorName.startsWith("#")) {
    return colorName;
  }

  const config = getColorConfig(colorName);
  return config.hex;
}

/**
 * Convert hex color to color name (reverse mapping)
 * Returns the color name if found, otherwise returns the hex as-is
 */
export function hexToColorName(hex?: string): ColorName | string {
  if (!hex) return "sky";

  // Find color by hex value
  const colorEntry = Object.entries(COLORS).find(([_, config]) => config.hex === hex);

  if (colorEntry) {
    return colorEntry[0] as ColorName;
  }

  // If no match found, return hex (backward compatibility)
  return hex;
}
