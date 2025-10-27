import { COLORS, type ColorName } from "@shared/data/Utils/colors";

interface ColorPickerProps {
  selectedColor: ColorName;
  onSelectColor: (color: ColorName) => void;
  className?: string;
}

export function ColorPicker({ selectedColor, onSelectColor, className = "" }: ColorPickerProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {Object.values(COLORS).map((colorConfig) => {
        const isSelected = selectedColor === colorConfig.name;
        return (
          <button
            key={colorConfig.name}
            type="button"
            onClick={() => onSelectColor(colorConfig.name)}
            className={`
              group relative w-10 h-10 rounded-lg transition-all
              ${colorConfig.bg} ${colorConfig.border} border-2
              ${isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-bg scale-110" : "hover:scale-105"}
            `}
            title={colorConfig.label}
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
            {/* Tooltip on hover */}
            <span
              className="
                absolute -top-8 left-1/2 -translate-x-1/2 
                px-2 py-1 text-xs rounded bg-bg-alt text-text
                opacity-0 group-hover:opacity-100 transition-opacity
                pointer-events-none whitespace-nowrap
                shadow-lg border border-bg-muted-light
              ">
              {colorConfig.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
