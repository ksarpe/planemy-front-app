/**
 * Centralized color system for labels, events, badges, etc.
 * Used across the application for consistent theming.
 */

export type ColorName = "cyan" | "pink" | "violet" | "indigo" | "rose" | "red";

export interface ColorConfig {
  name: ColorName;
  label: string; // Display name for UI
  hex: string; // Hex color - primary source of truth
}

/**
 * Available colors configuration
 * Hex colors are used everywhere - in UI (inline styles) and backend storage
 */
export const COLORS: Record<ColorName, ColorConfig> = {
  cyan: {
    name: "cyan",
    label: "Cyan",
    hex: "#00B3C7",
  },
  pink: {
    name: "pink",
    label: "Pink",
    hex: "#F72585",
  },
  violet: {
    name: "violet",
    label: "Violet",
    hex: "#7209B7",
  },
  indigo: {
    name: "indigo",
    label: "Indigo",
    hex: "#3A0CA3",
  },
  rose: {
    name: "rose",
    label: "Rose",
    hex: "#EAC8CA",
  },
  red: {
    name: "red",
    label: "Red",
    hex: "#EF4444",
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
  const colorName = (color as ColorName) || "cyan";
  return COLORS[colorName] || COLORS.cyan;
}

/**
 * Get hex color by name
 */
export function getColorHex(color?: ColorName | string): string {
  const config = getColorConfig(color);
  return config.hex;
}

/**
 * Get badge-specific inline styles
 */
export function getBadgeColorStyles(color?: ColorName | string): React.CSSProperties {
  const hex = getColorHex(color);
  return {
    backgroundColor: hex,
    borderColor: hex,
    color: "#ffffff",
  };
}

/**
 * Get color classes for borders/backgrounds (for compatibility)
 * Now returns empty string - use inline styles instead
 * @deprecated Use getColorHex and inline styles instead
 */
export function getBadgeColorClasses(_color?: ColorName | string): string {
  // Deprecated - kept for backward compatibility
  // Use getBadgeColorStyles or getColorHex instead
  return "";
}

/**
 * Get combined CSS classes for a color (deprecated)
 * @deprecated Use getColorHex and inline styles instead
 */
export function getColorClasses(_color?: ColorName | string): string {
  // Deprecated - kept for backward compatibility
  // Use inline styles with getColorHex instead
  return "";
}

/**
 * Convert color name to hex format for backend API
 * Backend expects format: #RRGGBB
 */
export function colorNameToHex(colorName?: ColorName | string): string {
  if (!colorName) return COLORS.cyan.hex;

  // If already hex format, return as-is
  if (typeof colorName === "string" && colorName.startsWith("#")) {
    return colorName;
  }

  const config = getColorConfig(colorName);
  return config.hex;
}

/**
 * Convert hex color to color name (reverse mapping)
 * Returns the color name if found, otherwise returns the first color as fallback
 */
export function hexToColorName(hex?: string): ColorName | string {
  if (!hex) return "cyan";

  // Find color by hex value
  const colorEntry = Object.entries(COLORS).find(([_, config]) => config.hex.toLowerCase() === hex.toLowerCase());

  if (colorEntry) {
    return colorEntry[0] as ColorName;
  }

  // If no match found, return first color as fallback
  return "cyan";
}
