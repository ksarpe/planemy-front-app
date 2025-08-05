// ActionButton.tsx
import { clsx } from "clsx";
import { ActionButtonProps } from "@/data/Common/interfaces";

// ZMIANA: Bardziej zaawansowana struktura stylów dla pełnej kontroli
const colorStyles = {
  green: {
    base: "bg-green-600 border-green-700 text-white dark:accent-success-dark",
    hover: "hover:bg-green-500 hover:border-green-600",
    focusRing: "focus-visible:ring-green-400",
  },
  accent_secondary: {
    base: "bg-orange-500 border-accent-secondary-dark text-white dark:bg-accent-secondary-dark",
    hover: "hover:bg-orange-400 hover:border-orange-500",
    focusRing: "focus-visible:ring-orange-400",
  },
  primary: {
    base: "bg-primary border-primary text-white",
    focusRing: "focus-visible:ring-blue-400",
  },
  red: {
    base: "bg-red-600 border-red-700 text-white",
    hover: "hover:bg-red-500 hover:border-red-600",
    focusRing: "focus-visible:ring-red-400",
  },
  gray: {
    base: "bg-gray-600 border-gray-700 text-white",
    hover: "hover:bg-gray-500 hover:border-gray-600",
    focusRing: "focus-visible:ring-gray-400",
  },
  white: {
    base: "bg-white border-gray-300 text-gray-800",
    hover: "hover:bg-gray-50 hover:border-gray-400",
    focusRing: "focus-visible:ring-blue-500",
  },
};

const sizeClasses: Record<NonNullable<ActionButtonProps["size"]>, string> = {
  xs: "px-2 py-1 text-xs",
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-4.5 text-lg",
};

const iconSizeClasses: Record<NonNullable<ActionButtonProps["size"]>, string> = {
  xs: "w-8 h-8",
  sm: "w-10 h-10",
  md: "w-12 h-12",
  lg: "w-14 h-14",
};

export default function ActionButton({
  onClick,
  icon: Icon,
  iconSize = 18,
  text,
  color,
  size = "md",
  disabled = false,
  className = "",
  justIcon = false,
}: ActionButtonProps) {
  const styles = colorStyles[color];

  if (justIcon) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={clsx(
          "flex items-center justify-center rounded-full border shadow-sm",
          "hover:-translate-y-0.5 active:scale-95 hover:shadow-lg",
          styles.base,
          styles.focusRing,
          iconSizeClasses[size],
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}>
        <span className="sr-only">{text}</span>
        <Icon size={iconSize} />
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "flex items-center justify-center gap-2 rounded-md font-semibold shadow-sm",
        "hover:-translate-y-0.5 hover:shadow-lg",
        styles.base,
        styles.focusRing,
        sizeClasses[size],
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}>
      <Icon size={iconSize} />
      <span>{text}</span>
    </button>
  );
}
