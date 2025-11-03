import { COLORS, type ColorName } from "@shared/data/Utils/colors";
import { Tooltip } from "./Tooltip";

interface ColorPickerProps {
  selectedColor: ColorName;
  onSelectColor: (color: ColorName) => void;
  className?: string;
}

export function ColorPicker({ selectedColor, onSelectColor, className = "" }: ColorPickerProps) {
  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {Object.values(COLORS).map((colorConfig) => {
        const isSelected = selectedColor === colorConfig.name;
        return (
          <Tooltip key={colorConfig.name} content={colorConfig.label} position="top">
            <button
              type="button"
              onClick={() => onSelectColor(colorConfig.name)}
              className={`
                w-10 h-10 rounded-2xl transition-all cursor-pointer
                ${colorConfig.bg} ${colorConfig.border} border-2
                ${isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-bg scale-110" : "hover:scale-105"}
              `}
              aria-label={`Select ${colorConfig.label} color`}>
              {/* Checkmark for selected color */}
              {isSelected && (
                <svg
                  className={`w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${colorConfig.text}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          </Tooltip>
        );
      })}
    </div>
  );
}
