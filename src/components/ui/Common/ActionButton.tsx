import { LucideIcon } from "lucide-react";

interface ActionButtonProps {
  onClick: () => void;
  icon: LucideIcon;
  iconSize?: number;
  text: string;
  color: "green" | "orange" | "blue" | "red" | "gray" | "white";
  size?: "xs" | "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
}

const colorClasses = {
  green: "bg-green-600 hover:bg-green-700 text-white",
  orange: "bg-orange-600 text-white hover:bg-orange-700",
  blue: "bg-blue-600 hover:bg-blue-700",
  red: "bg-red-600 hover:bg-red-700",
  gray: "bg-gray-600 hover:bg-gray-700",
  white: "bg-white hover:bg-gray-100",
};

const sizeClasses = {
  xs: "px-2 py-1 min-h-[29px]",
  sm: "px-3 py-2 min-h-[40px]",
  md: "px-4 py-2 min-h-[48px]",
  lg: "px-4 py-3 min-h-[62px]",
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
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center gap-2 rounded-lg transition-all duration-200 
        shadow-sm hover:shadow-md cursor-pointer
        ${colorClasses[color]} 
        ${sizeClasses[size]}
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"}
        ${className}
      `}>
      <Icon size={iconSize} />
      <span className="text-sm font-medium">{text}</span>
    </button>
  );
}
