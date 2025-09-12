import type { ExtendedShoppingHeaderProps } from "@shared/data/Shopping/Components/ShoppingComponentInterfaces";
import { MoreVertical } from "lucide-react";
import { ShoppingProgress } from "./ShoppingProgress";
import { useT } from "@shared/hooks/utils/useT";

export function ShoppingHeader({ name, stats, onToggleLists, listsOpen }: ExtendedShoppingHeaderProps) {
  const { t } = useT();
  const { pending, completed, totalValue } = stats;

  return (
    // Main container
    <div className="flex flex-col gap-4">
      {/* name and lists button */}
      <div className="flex gap-2">
        <h1 className="text-2xl">{name}</h1>
        {onToggleLists && !listsOpen && (
          <button
            type="button"
            onClick={onToggleLists}
            className="px-2 py-2 rounded-md bg-bg-hover border border-bg-hover hover:bg-primary transition-colors text-xs sm:text-sm cursor-pointer">
            <MoreVertical size={14} />
          </button>
        )}
      </div>

      {/* Statistics Cards + progress */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {/* Do kupienia */}
        <div className="bg-white rounded-md p-2 shadow-md flex flex-col justify-evenly h-full">
          <span className="text-xs sm:text-sm font-medium text-text-muted whitespace-nowrap">
            {t("shopping.stats.toBuy")}
          </span>
          <div className="text-lg sm:text-2xl font-bold text-text">{pending}</div>
        </div>

        {/* Kupione */}
        <div className="bg-white rounded-md p-2 shadow-md flex flex-col justify-evenly h-full">
          <span className="text-xs sm:text-sm font-medium text-success whitespace-nowrap">
            {t("shopping.stats.bought")}
          </span>
          <div className="text-lg sm:text-2xl font-bold text-text">{completed}</div>
        </div>

        {/* Wartość */}
        <div className="bg-white rounded-md p-2 shadow-md flex flex-col justify-evenly h-full">
          <span className="text-xs sm:text-sm font-medium text-purple-600 whitespace-nowrap">
            {t("shopping.stats.value")}
          </span>
          <div className="text-lg sm:text-xl font-bold text-text flex items-end gap-1">
            {totalValue.toFixed(2)}
            <span className="text-xs">{t("shopping.stats.currency")}</span>
          </div>
        </div>
        <div className="col-span-3">
          <ShoppingProgress total={pending + completed} completed={completed} />
        </div>
      </div>
    </div>
  );
}
