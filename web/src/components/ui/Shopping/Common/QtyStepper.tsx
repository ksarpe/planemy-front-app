import { Plus, Minus } from "lucide-react";
import type { QtyStepperProps } from "@shared/data/Shopping/UI/CommonInterfaces";

export function QtyStepper({ value, onDecrease, onIncrease, disabledDecrease = false, size = "sm" }: QtyStepperProps) {
  const sizeClasses = size === "sm" ? "h-6 w-6" : "h-7 w-7";
  const iconSize = size === "sm" ? 12 : 14;

  return (
    <div className="inline-flex items-center rounded-full border border-gray-300 bg-white overflow-hidden">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDecrease();
        }}
        disabled={disabledDecrease}
        className={`${sizeClasses} flex items-center justify-center hover:bg-red-100 disabled:opacity-40 transition-colors`}
        aria-label="Zmniejsz ilość">
        <Minus size={iconSize} />
      </button>
      <span className="px-2 text-sm font-medium tabular-nums min-w-[2rem] text-center">{value}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onIncrease();
        }}
        className={`${sizeClasses} flex items-center justify-center hover:bg-green-100 transition-colors`}
        aria-label="Zwiększ ilość">
        <Plus size={iconSize} />
      </button>
    </div>
  );
}
