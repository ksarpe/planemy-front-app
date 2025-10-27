/**
 * Centralized color system for labels, events, badges, etc.
 * Used across the application for consistent theming.
 */

export type ColorName = "sky" | "amber" | "violet" | "rose" | "emerald" | "orange";

export interface ColorConfig {
  name: ColorName;
  label: string; // Display name for UI
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
  sky: {
    name: "sky",
    label: "Sky Blue",
    bg: "bg-primary/10",
    bgHover: "hover:bg-primary/20",
    text: "text-primary",
    border: "border-primary/20",
  },
  amber: {
    name: "amber",
    label: "Amber",
    bg: "bg-yellow-100",
    bgHover: "hover:bg-yellow-200",
    text: "text-yellow-900",
    border: "border-yellow-200",
  },
  violet: {
    name: "violet",
    label: "Violet",
    bg: "bg-purple-100",
    bgHover: "hover:bg-purple-200",
    text: "text-purple-900",
    border: "border-purple-200",
  },
  rose: {
    name: "rose",
    label: "Rose",
    bg: "bg-pink-100",
    bgHover: "hover:bg-pink-200",
    text: "text-pink-900",
    border: "border-pink-200",
  },
  emerald: {
    name: "emerald",
    label: "Emerald",
    bg: "bg-green-100",
    bgHover: "hover:bg-green-200",
    text: "text-green-900",
    border: "border-green-200",
  },
  orange: {
    name: "orange",
    label: "Orange",
    bg: "bg-orange-100",
    bgHover: "hover:bg-orange-200",
    text: "text-orange-900",
    border: "border-orange-200",
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
  const colorName = (color as ColorName) || "sky";
  return COLORS[colorName] || COLORS.sky;
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
