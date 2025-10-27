/**
 * Centralized color system for labels, events, badges, etc.
 * Used across the application for consistent theming.
 */

export type ColorName = "blue" | "green" | "yellow" | "red" | "purple";

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
  blue: {
    name: "blue",
    label: "Blue",
    hex: "#3B82F6",
    bg: "bg-blue-500",
    bgHover: "hover:bg-blue-600",
    text: "text-white",
    border: "border-blue-500",
  },
  green: {
    name: "green",
    label: "Green",
    hex: "#22C55E",
    bg: "bg-green-500",
    bgHover: "hover:bg-green-600",
    text: "text-white",
    border: "border-green-500",
  },
  yellow: {
    name: "yellow",
    label: "Yellow",
    hex: "#EAB308",
    bg: "bg-yellow-500",
    bgHover: "hover:bg-yellow-600",
    text: "text-white",
    border: "border-yellow-500",
  },
  red: {
    name: "red",
    label: "Red",
    hex: "#EF4444",
    bg: "bg-red-500",
    bgHover: "hover:bg-red-600",
    text: "text-white",
    border: "border-red-500",
  },
  purple: {
    name: "purple",
    label: "Purple",
    hex: "#8B5CF6",
    bg: "bg-purple-500",
    bgHover: "hover:bg-purple-600",
    text: "text-white",
    border: "border-purple-500",
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
  const colorName = (color as ColorName) || "blue";
  return COLORS[colorName] || COLORS.blue;
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
  if (!colorName) return COLORS.blue.hex;

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
  if (!hex) return "blue";

  // Find color by hex value
  const colorEntry = Object.entries(COLORS).find(([_, config]) => config.hex === hex);

  if (colorEntry) {
    return colorEntry[0] as ColorName;
  }

  // If no match found, return hex (backward compatibility)
  return hex;
}
