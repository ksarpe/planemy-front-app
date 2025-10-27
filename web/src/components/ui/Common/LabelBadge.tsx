import { getBadgeColorClasses, type ColorName } from "@shared/data/Utils/colors";
import { X } from "lucide-react";

interface LabelBadgeProps {
  name: string;
  color: ColorName;
  onRemove?: () => void;
  className?: string;
}

/**
 * Badge component specifically for Labels
 * Uses the centralized color system from colors.ts
 */
export function LabelBadge({ name, color, onRemove, className = "" }: LabelBadgeProps) {
  const colorClasses = getBadgeColorClasses(color);

  return (
    <span
      className={`
        inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full
        border transition-colors
        ${colorClasses}
        ${className}
      `}>
      <span className="font-medium">{name}</span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:opacity-70 transition-opacity"
          aria-label={`Remove ${name}`}>
          <X size={14} />
        </button>
      )}
    </span>
  );
}
