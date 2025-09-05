// ActionButton.tsx
import { clsx } from "clsx";
import { ActionButtonProps } from "@shared/data/Common/interfaces";

// ZMIANA: Bardziej zaawansowana struktura stylów dla pełnej kontroli
const colorStyles = {
  green: {
    base: "bg-success border-success-hover text-white ",
    hover: "hover:bg-success-hover",
  },
  accent_secondary: {
    base: "bg-orange-500 border-accent-secondary-dark text-white ",
    hover: "hover:bg-orange-400 hover:border-orange-500",
  },
  primary: {
    base: "bg-primary border-primary text-white",
    hover: "hover:bg-text-muted hover:border-text-muted",
  },
  red: {
    base: "bg-red-600 border-red-700 text-white",
    hover: "hover:bg-red-500 hover:border-red-600",
  },
  gray: {
    base: "bg-gray-600 border-gray-700 text-white",
    hover: "hover:bg-gray-500 hover:border-gray-600",
  },
  white: {
    base: "bg-white border-gray-300 text-gray-800",
    hover: "hover:bg-gray-50 hover:border-gray-400",
  },
};

const sizeClasses: Record<NonNullable<ActionButtonProps["size"]>, string> = {
  xs: "px-2 py-1 text-xs",
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2 text-lg",
};

const iconSizeClasses: Record<NonNullable<ActionButtonProps["size"]>, string> = {
  xs: "w-8 h-8",
  sm: "w-10 h-10",
  md: "w-12 h-12",
  lg: "w-12 h-12",
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
          "flex items-center flex-col justify-center rounded-md w-full cursor-pointer",
          styles.base,
          styles.hover,
          iconSizeClasses[size],
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}>
        <Icon size={iconSize} />
        <span className="text-xs">{text}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "flex items-center justify-center gap-2 rounded-md font-semibold shadow-md",
        " hover:shadow-lg",
        styles.base,
        styles.hover,
        sizeClasses[size],
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}>
      <Icon size={iconSize} />
      <span>{text}</span>
    </button>
  );
}
